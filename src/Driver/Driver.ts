import { FluentParserBuilder } from '../utils/FluentParser/FluentParserBuilder';
import { FluentBuilder } from '../utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IoCache } from './IoCache';
import { IoState } from "./IoState";
import { ResponseFrameType } from './ResponseFrameType';
import { RequestFrameType } from './RequestFrameType';
import { Serial } from './Serial';
import { IoInfo } from './IoInfo';

interface AlfaBoardParserData
{
    type: ResponseFrameType;
    push: boolean;
    err: number;
    addr: number;
    value: number;
    input1: number;
    input2: number;
    input3: number;
    input4: number;
    input5: number;
    input6: number;
    adc1: number;
    adc2: number;
    adc3: number;
    adc4: number;
    rtc: number;
}

@injectable()
export class Driver
{
    private RequestHeader = 0xAABB;
    private serial: Serial = new Serial();
    private cache: IoCache = new IoCache(this.IoCount);
    private onUpdateCallback?: (ioState: IoState) => void;
    
    public get Info(): IoInfo[]
    {
        let addr = 0;
        return [
            { addr: addr++, name: "Input1", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input2", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input3", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input4", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input5", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input6", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Adc1", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "Adc2", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "Adc3", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "Adc4", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "RTC", type: "RTC", readonly: true, minValue: 0, maxValue: 0xFFFFFFFF },
            { addr: addr++, name: "Output1", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output2", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output3", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output4", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output5", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output6", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output7", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Pwm1", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Pwm2", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Pwm3", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Pwm4", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Display1", type: "DISPLAY", readonly: false, minValue: 0, maxValue: 9999 },
            { addr: addr++, name: "Display1Dot", type: "DISPLAY_DOT", readonly: false, minValue: 0, maxValue: 4 },
            { addr: addr++, name: "Buzzer1Enable", type: "BUZZER_ENABLE", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Buzzer1Volume", type: "BUZZER_VOLUME", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Buzzer1Frequency", type: "BUZZER_FREQ", readonly: false, minValue: 0, maxValue: 1024 },
        ];
    }

    public get IoCount(): number
    {
        return this.Info.length;
    }

    public Connect(port: string): void
    {
        this.serial.OnConnection(() =>
        {
            this.SetPush(true, 20);
        });

        this.serial.OnData((data) =>
        {
            data.forEach(b => parser.Parse(b));
        });

        const parserBuilder = new FluentParserBuilder<AlfaBoardParserData>();
        const parser = parserBuilder
            .Is(0xAB)
            .If(ResponseFrameType.Pong, 'type', _ => _)  
            .If(ResponseFrameType.PushStateUpdate, 'type', _ => _.Get('push'))
            .If(ResponseFrameType.Error, 'type', _ => _.Get('err'))
            .If(ResponseFrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
            .If(ResponseFrameType.UpdateAll, 'type', _ => _
                .Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4').Get4LE('input5').Get4LE('input6')
                .Get4LE('adc1').Get4LE('adc2').Get4LE('adc3').Get4LE('adc4')
                .Get4LE('rtc'))
            .IsXor()
            .Build();

        parser.OnComplete((out: AlfaBoardParserData) =>
        {
            switch (out.type)
            {
                case ResponseFrameType.PushStateUpdate:
                    console.log('PUSH IS', out.push ? 'ON' : 'OFF');
                    break;

                case ResponseFrameType.UpdateAll:
                    const sensors: number[] = [out.input1, out.input2, out.input3, out.input4, out.input5, out.input6, out.adc1, out.adc2, out.adc3, out.adc4, out.rtc];
                    sensors.forEach((value, addr) =>
                    {
                        this.UpdateCache(addr, value);
                    });
                    break;

                case ResponseFrameType.Error:
                    console.log('board error', out.err);
                    break;

                case ResponseFrameType.Pong:
                    console.log('pong from board');
                    break;

                case ResponseFrameType.Update:
                    this.UpdateCache(out.addr, out.value);
                    break;

                default:
                    throw new Error('Unknown response');
            }
        });

        parser.OnFault((reason, frame) =>
        {
            console.log('FAULT', reason);
        });

        this.serial.Connect(port, 19200);
    }

    private UpdateCache(addr: number, value: number) 
    { 
        if (this.cache.HasChanged(addr, value)) 
        {
            this.cache.Update(addr, value);

            if (this.onUpdateCallback) 
            {
                const ioState: IoState = this.cache.GetIoState(addr);

                if (ioState.IsNotInitialValue()) 
                {
                    this.onUpdateCallback(ioState);
                }
            }
        }
    }

    public Read(addr: number): number
    {
        return this.cache.Get(addr);
    }

    public OnUpdate(callback)
    {
        this.onUpdateCallback = callback;
    }

    public ValidateValue(addr: number, value: number): void
    {
        const io: IoInfo | undefined = this.Info.find(io => io.addr === addr);

        if (io === undefined)
        {
            throw new Error(`IO ${addr} not found`);
        }

        if (io.readonly)
        {
            throw new Error('Can not write to sensor');
        }

        if (value > io.maxValue)
        {
            throw new Error('Out of range. Max value is ' + io.maxValue.toString());
        }

        if (value < io.minValue)
        {
            throw new Error('Out of range. Min value is ' + io.minValue.toString());
        }
    }

    public Ping(): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType.Ping)
            .Byte(0) // frame size
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    public Set(addr: number, value: number): void
    {
        this.ValidateValue(addr, value);

        const frame = (new FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType.Set)
            .Byte(5) // frame size
            .Byte(addr)
            .Word4LE(value)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    private Get(addr: number): void
    {
        const frame = (new FluentBuilder())
            .Word2LE(this.RequestHeader)
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
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType.GetAll)
            .Byte(0) // frame size
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    private SetPush(enable: boolean, interval: number): void
    {
        console.log('TRYING TO SET PUSH');
        const frame = (new FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType.PushStateSet)
            .Byte(2) // frame size
            .Byte(enable ? 1 : 0)
            .Byte(interval)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }
}
