import 'reflect-metadata';
import { FluentParserBuilder } from '../utils/FluentParser/FluentParserBuilder';
import { FluentBuilder } from '../utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import { IoCache } from './IoCache';
import { IoState } from "./IoState";
import { ResponseFrameType } from './ResponseFrameType';
import { RequestFrameType } from './RequestFrameType';
import { Serial } from './Serial';
import { IoInfo } from './IoInfo';
import { BluePillBoardParserData } from './BluePillBoardParserData';
import { Addr } from './Addr';

@injectable()
export class Driver
{
    private RequestHeader = 0xAABB;
    private serial: Serial = new Serial();
    private cache: IoCache = new IoCache(this.IoCount);
    private onUpdateCallback?: (ioState: IoState) => void;

    public get State(): IoState[]
    {
        return this.cache.Entries;
    }

    public get Info(): IoInfo[]
    {
        return [
            { addr: Addr.Input1, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Input2, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Input3, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Input4, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Input5, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Input6, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Input7, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr.Adc1, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr.Adc2, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr.Adc3, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr.Adc4, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr.RTC, readonly: true, minValue: 0, maxValue: 0xFFFFFFFF },
            { addr: Addr.Output1, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Output2, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Output3, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Output4, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Output5, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Output6, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Output7, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr.Pwm1, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr.Pwm2, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr.Pwm3, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr.Pwm4, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr.Display1, readonly: false, minValue: 0, maxValue: 9999 },
            { addr: Addr.Display1Dot, readonly: false, minValue: 0, maxValue: 4 },
        ];
    }

    public get IoCount(): number
    {
        return this.Info.length;
    }

    public async Disconnect(): Promise<void>
    {
        await this.serial.Disconnect();
    }

    public Connect(port: string): void
    {
        this.serial.OnConnection(() =>
        {
            // this.SetPush(true, 20);
        });

        this.serial.OnData((data) =>
        {
            data.forEach(b => parser.Parse(b));
        });

        const parserBuilder = new FluentParserBuilder<BluePillBoardParserData>();
        const parser = parserBuilder
            .Is(0xAB)
            .If(ResponseFrameType.Pong, 'type', _ => _)
            .If(ResponseFrameType.ConfigUpdate, 'type', _ => _.Get('pushMode').Get('samplingInterval'))
            .If(ResponseFrameType.Error, 'type', _ => _.Get('err'))
            .If(ResponseFrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
            .If(ResponseFrameType.UpdateAllSensors, 'type', _ => _
                .Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4').Get4LE('input5').Get4LE('input6').Get4LE('input7')
                .Get4LE('adc1').Get4LE('adc2').Get4LE('adc3').Get4LE('adc4')
                .Get4LE('rtc'))
            .IsXor() 
            .Build();

        parser.OnComplete((out: BluePillBoardParserData) =>
        {
            this.ExecuteFrame(out);
        });

        let faultsCounter = 0;
        parser.OnFault((reason, frame) =>
        {
            faultsCounter++;

            if ((faultsCounter % 100) === 0)
                console.log('FAULTs', faultsCounter);
        });

        this.serial.Connect(port, 19200);
    }

    private ConfigAsString(out: BluePillBoardParserData)
    {
        switch (out.pushMode)
        {
            case 0:
                console.log('PUSH IS OFF');
                break;
            case 1:
                console.log('PUSH ALL IS ON. Interval:', out.samplingInterval);
                break;
            case 2:
                console.log('PUSH SINGLE IS ON. Interval:', out.samplingInterval);
                break;
            default:
                console.log('PUSH IS IN INVALID STATE');
                break;
        }
    }

    private ExecuteFrame(out: BluePillBoardParserData)
    {
        switch (out.type)
        {
            case ResponseFrameType.ConfigUpdate:
                this.ConfigAsString(out);
                break;
            
            case ResponseFrameType.UpdateAllSensors:
                const sensors: number[] = [out.input1, out.input2, out.input3, out.input4, out.input5, out.input6, out.input7, out.adc1, out.adc2, out.adc3, out.adc4, out.rtc];
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
    }

    private UpdateCache(addr: number, value: number) 
    {
        if (this.cache.HasChanged(addr, value)) 
        {
            this.cache.Update(addr, value);

            if (this.onUpdateCallback) 
            {
                const ioState: IoState = this.cache.GetIoState(addr);

                this.onUpdateCallback(ioState);
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
            throw new Error(`IO ${ addr } not found`);
        }

        if (io.readonly)
        {
            throw new Error(`Can not write to sensor (addr: ${ addr })`);
        }

        if (value > io.maxValue)
        {
            throw new Error(`Out of range. Max value is ${ io.maxValue.toString() } but try to set ${ value }`);
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
        value = Math.round(value);

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
            .Byte(RequestFrameType.GetAllSensors)
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
            .Byte(RequestFrameType.ConfigSet)
            .Byte(2) // frame size
            .Byte(enable ? 1 : 0)
            .Byte(interval)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }
}
