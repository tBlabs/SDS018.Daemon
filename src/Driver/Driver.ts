import { FluentParserBuilder } from '../utils/FluentParser/FluentParserBuilder';
import { FluentBuilder } from '../utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IoCache } from './IoCache';
import { IoState } from "./IoState";
import { ResponseFrameType } from './ResponseFrameType';
import { RequestFrameType } from './RequestFrameType';
import { Serial } from './Serial';

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
    adc1: number;
    adc2: number;
    temp1: number;
    rtc: number;
}

interface IoInfo
{
    addr: number;
    name: string;
    type: string;
    readonly: boolean;
    minValue: number;
    maxValue: number;
    events?: string[];
}

@injectable()
export class Driver
{
    private RequestHeader = 0xAABB;
    private serial: Serial = new Serial();
    private cache: IoCache = new IoCache();
    private onUpdateCallback?: (ioState: IoState) => void;

    constructor()
    {
        
    }
    
    public get Info(): IoInfo[]
    {
        return [
            { addr: 0, name: "Input1", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: 1, name: "Input2", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: 2, name: "Input3", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: 3, name: "Input4", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: 4, name: "Adc1", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: 5, name: "Adc2", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: 6, name: "TemperatureSensor1", type: "TEMP", readonly: true, minValue: 0, maxValue: 9999 },
            { addr: 7, name: "Clock1", type: "RTC", readonly: true, minValue: 0, maxValue: 0xFFFFFFFF },
            { addr: 8, name: "Clock1Setter", type: "RTC", readonly: false, minValue: 0, maxValue: 0xFFFFFFFF },
            { addr: 9, name: "Output1", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: 10, name: "Output2", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: 11, name: "Output3", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: 12, name: "Output4", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: 13, name: "Pwm1", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: 14, name: "Pwm2", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: 15, name: "Pwm3", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: 16, name: "Pwm4", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: 17, name: "Display1", type: "DISPLAY", readonly: false, minValue: 0, maxValue: 9999 },
            { addr: 18, name: "Display1Dot", type: "DISPLAY_DOT", readonly: false, minValue: 0, maxValue: 4 },
            { addr: 19, name: "Display2", type: "DISPLAY", readonly: false, minValue: 0, maxValue: 9999 },
            { addr: 20, name: "Display2Dot", type: "DISPLAY_DOT", readonly: false, minValue: 0, maxValue: 4 },
            { addr: 21, name: "Display3", type: "DISPLAY", readonly: false, minValue: 0, maxValue: 9999 },
            { addr: 22, name: "Display3Dot", type: "DISPLAY_DOT", readonly: false, minValue: 0, maxValue: 4 },
            { addr: 23, name: "Display4", type: "DISPLAY", readonly: false, minValue: 0, maxValue: 9999 },
            { addr: 24, name: "Display4Dot", type: "DISPLAY_DOT", readonly: false, minValue: 0, maxValue: 4 },
            { addr: 25, name: "Buzzer1Volume", type: "BUZZER_VOLUME", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: 26, name: "Buzzer1Frequency", type: "BUZZER_FREQ", readonly: false, minValue: 0, maxValue: 1024 },
            // TODO: Change to Buzzer1Enable
            { addr: 27, name: "DAC1", type: "DAC", readonly: false, minValue: 0, maxValue: 1024 },
        ];
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
        .If(ResponseFrameType.Pong, 'type', _ => _) // TODO: change to isPong
        .If(ResponseFrameType.PushStateUpdate, 'type', _ => _.Get('push'))
        .If(ResponseFrameType.Error, 'type', _ => _.Get('err'))
        .If(ResponseFrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
        .If(ResponseFrameType.UpdateAll, 'type', _ => _
        .Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4')
        .Get4LE('adc1').Get4LE('adc2').Get4LE('temp1').Get4LE('rtc'))
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
                const sensors: number[] = [out.input1, out.input2, out.input3, out.input4, out.adc1, out.adc2, out.temp1, out.rtc];         
                sensors.forEach((value, addr) =>
                {
                    this.UpdateCache(addr, value);
                })
                break;
                
                case ResponseFrameType.Error:
                console.log('board error', out.err);
                break;
                
                case ResponseFrameType.Pong:
                console.log('pong from board');
                break;
                
                case ResponseFrameType.Update:
                // if (this.cache[out.addr] !== out.value)
                // {
                //     // console.log('Update', out.addr, out.value);
                //     this.cache[out.addr] = out.value;
                //     // TODO: do the same what for UpdateAll
                // }
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
            throw new Error('Not found');
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
