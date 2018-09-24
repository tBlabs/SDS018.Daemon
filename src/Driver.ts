import * as SerialPort from 'serialport';
import { FluentParserBuilder } from './utils/FluentParser/FluentParserBuilder';
import { FluentBuilder } from './utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import 'reflect-metadata';

enum FrameType
{
    Ping = 0x01,
    Update = 0x02,
    Get = 0x03,
    Set = 0x04,
    Error = 0x05,
    Pong = 0x06,
    GetAll = 0x07,
    UpdateAll = 0x08,
}

interface AlfaBoardData
{
    type: number;
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
    private isConnected: boolean = false;

    constructor()
    {
        setInterval(() =>
        {
            if (this.isConnected)
            {
                //    this.Info.filter(io => io.Readonly).forEach(io => this.Get(io.Addr));
                // this.Get(5);
                // this.Get(2);
                // this.Get(3);
                // this.Get(4);
                this.GetAll();
            }
        },
        20);
    }

    private serial: SerialPort;

    public get Info(): IoInfo[]
    {
        let addr = 0;
        return [
            { Addr: addr++, Name: "Input 1", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Input 2", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Input 3", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Input 4", Type: "INPUT", Readonly: true, MinValue: 0, MaxValue: 1 },
            { Addr: addr++, Name: "Adc 1", Type: "ADC", Readonly: true, MinValue: 0, MaxValue: 100 },
            { Addr: addr++, Name: "Adc 2", Type: "ADC", Readonly: true, MinValue: 0, MaxValue: 100 },
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

    private cache: any = {};

    public Connect(port: string): void
    {
        this.serial = new SerialPort(port, { baudRate: 19200 });

        const parserBuilder = new FluentParserBuilder<AlfaBoardData>();
        const parser = parserBuilder
            .Is(0xAB)
            .If(FrameType.Pong, 'type', _ => _)
            .If(FrameType.Error, 'type', _ => _.Get('err'))
            .If(FrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
            .If(FrameType.UpdateAll, 'type', _ => _.Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4').Get4LE('adc1').Get4LE('adc2'))
            .IsXor()
            .Build();

        parser.OnComplete((out, frame) =>
        {
            // console.log(frame);
            switch (out.type)
            {
                case FrameType.UpdateAll:
                    console.log(out.input1, out.input2, out.input3, out.input4, out.adc1, out.adc2);
                    break;
                case FrameType.Error:
                    console.log('error', out.err);
                    break;
                case FrameType.Pong:
                    console.log('test ok');
                    break;
                case FrameType.Update:
                    if (this.cache[out.addr] !== out.value)
                    {
                        console.log('Update', out.addr, out.value);
                        this.cache[out.addr] = out.value;
                    }
                    break;
                default:
                    console.log('unknown frame type');
                    break;
            }
        });

        parser.OnFault((reason, frame) =>
        {
            console.log('FFFFFFFFFFFFFFFFFFFFAULT', reason, frame);
        });

        this.serial.on('data', (data: Buffer) =>
        {
            //  console.log('DATA', data);
            data.forEach(b => parser.Parse(b));
        });

        this.serial.on('open', () =>
        {
            console.log('SERIAL OPEN');
            this.isConnected = true;
        });

        this.serial.on('error', (err) =>
        {
            console.log("SERIAL ERROR", err);
        });

        this.serial.on('close', () =>
        {
            console.log('SERIAL CLOSE');
            this.isConnected = false;
        });
    }

    public Set(addr: number, value: number): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(FrameType.Set)
            .Byte(5) // frame size
            .Byte(addr)
            .Word4LE(value)
            .Xor()
            .Build();
        //   console.log('sending', frame);
        this.serial.write(frame);
    }

    public Ping(): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(FrameType.Ping)
            .Byte(0) // frame size
            .Xor()
            .Build();
        // console.log('sending', frame);
        this.serial.write(frame);
    }

    private Get(addr): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(FrameType.Get)
            .Byte(1) // frame size
            .Byte(addr)
            .Xor()
            .Build();
        //  console.log('sending', frame);
        this.serial.write(frame, (err, bytesWritten) =>
        {
            if (err)
                console.log('WRITE', err, bytesWritten);
        });
    }

    private GetAll(): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(0xAABB)
            .Byte(FrameType.GetAll)
            .Byte(0) // frame size
            .Xor()
            .Build();
        //  console.log('sending', frame);
        this.serial.write(frame, (err, bytesWritten) =>
        {
            if (err)
                console.log('WRITE', err, bytesWritten);
        });
    }

    public Read(addr): number
    {
        return this.cache[addr];
    }
}
