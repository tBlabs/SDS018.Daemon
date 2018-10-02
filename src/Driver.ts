import * as SerialPort from 'serialport';
import { FluentParserBuilder } from './utils/FluentParser/FluentParserBuilder';
import { FluentBuilder } from './utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Cache } from './Cache';
import { ResponseFrameType } from './ResponseFrameType';
import { RequestFrameType } from './RequestFrameType';
import { Serial } from './utils/SerialPort';

interface AlfaBoardData
{
    type: ResponseFrameType;
    push: boolean;
    err: number;
    addr: number;
    value: number;
}

interface IoInfo
{
    Addr: number;
    Name: string;
    Type: string;
    Readonly: boolean;
    MinValue: number;
    MaxValue: number;
}

@injectable()
export class Driver
{
    private serial: Serial = new Serial();
    private isConnected: boolean = false;
    private cache: Cache = new Cache();

    public get Info(): IoInfo[]
    {
        let addr = 0;
        return [
            { Addr: addr++, Name: "Input 1", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Input 2", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Input 3", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Input 4", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Adc 1", Type: "ADC", Readonly: true, MinValue: 0, MaxValue: 409 },
            { Addr: addr++, Name: "Adc 2", Type: "ADC", Readonly: true, MinValue: 0, MaxValue: 409 },
            { Addr: addr++, Name: "Temperature sensor 1", Type: "TEMP", Readonly: true, MinValue: 0, MaxValue: 9999 },
            { Addr: addr++, Name: "Clock 1", Type: "RTC", Readonly: true, MinValue: 0, MaxValue: 0xFFFFFFFF },
            { Addr: addr++, Name: "Output 1", Type: "OUTPUT", Readonly: false, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Output 2", Type: "OUTPUT", Readonly: false, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Output 3", Type: "OUTPUT", Readonly: false, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Output 4", Type: "OUTPUT", Readonly: false, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Pwm 1", Type: "PWM", Readonly: false, MinValue: 0, MaxValue: 1024 },
            { Addr: addr++, Name: "Pwm 2", Type: "PWM", Readonly: false, MinValue: 0, MaxValue: 1024 },
            { Addr: addr++, Name: "Pwm 3", Type: "PWM", Readonly: false, MinValue: 0, MaxValue: 1024 },
            { Addr: addr++, Name: "Pwm 4", Type: "PWM", Readonly: false, MinValue: 0, MaxValue: 1024 },
        ];
    }

    public Connect(port: string): void
    {
        this.serial.OnConnection(() =>
        {
            this.PushEnable(true, 20);
        });
        this.serial.OnData((data) =>
        {
            data.forEach(b => parser.Parse(b));
        });
        setInterval(() =>
        {
            this.GetAll();
        },
            333);
        this.serial.Connect(port, 19200);

        const parserBuilder = new FluentParserBuilder<AlfaBoardData>();
        const parser = parserBuilder
            .Is(0xAB)
            .If(ResponseFrameType.Pong, 'type', _ => _) // TODO: change to isPong
            .If(ResponseFrameType.PushStateUpdate, 'type', _ => _.Get('push'))
            .If(ResponseFrameType.Error, 'type', _ => _.Get('err'))
            .If(ResponseFrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
            .If(ResponseFrameType.UpdateAll, 'type', _ => _
                .Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4')
                .Get4LE('adc1').Get4LE('adc2').Get4LE('temp1').Get4LE('rtc'))
            .IsXor()
            .Build();

        parser.OnComplete((out, frame) =>
        {
            switch (out.type)
            {
                case ResponseFrameType.PushStateUpdate:
                    console.log('PUSH', out.push);
                    break;

                case ResponseFrameType.UpdateAll:
                    this.cache.Update(0, out.input1);
                    this.cache.Update(1, out.input2);
                    this.cache.Update(2, out.input3);
                    this.cache.Update(3, out.input4);
                    this.cache.Update(4, out.adc1);
                    this.cache.Update(5, out.adc2);
                    this.cache.Update(6, out.temp1);
                    this.cache.Update(7, out.rtc);

                    if (this.cache.HasChanged())
                        console.log(this.cache.toString());
                    break;
                case ResponseFrameType.Error:
                    console.log('error', out.err);
                    break;
                case ResponseFrameType.Pong:
                    console.log('test ok');
                    break;
                case ResponseFrameType.Update:
                    if (this.cache[out.addr] !== out.value)
                    {
                        console.log('Update', out.addr, out.value);
                        this.cache[out.addr] = out.value;
                    }
                    break;
                default:
                    throw new Error('Unknown response');
            }
        });

        parser.OnFault((reason, frame) =>
        {
            console.log('FAULT', reason, frame);
        });

     
    }

    public Set(addr: number, value: number): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(RequestFrameType.Set)
            .Byte(5) // frame size
            .Byte(addr)
            .Word4LE(value)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    public Ping(): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(RequestFrameType.Ping)
            .Byte(0) // frame size
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    private Get(addr: number): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(RequestFrameType.Get)
            .Byte(1) // frame size
            .Byte(addr)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    private GetAll(): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(RequestFrameType.GetAll)
            .Byte(0) // frame size
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    private PushEnable(enable: boolean, interval: number): void
    {
        console.log('Push enable');

        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(RequestFrameType.PushStateSet)
            .Byte(2) // frame size
            .Byte(enable ? 1 : 0)
            .Byte(interval)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    public Read(addr: number): number
    {
        return this.cache.Get(addr);
    }
}
