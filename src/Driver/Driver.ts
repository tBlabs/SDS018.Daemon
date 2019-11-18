import 'reflect-metadata';
import { FluentParserBuilder } from '../utils/FluentParser/FluentParserBuilder';
import { FluentBuilder } from '../utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import { IoCache } from './IoCache';
import { IoState } from "./IoState";
import { Serial } from './Serial';
import { IoInfo } from './IoInfo';
import { ParserData } from './BluePillBoardParserData';

@injectable()
export class Driver
{
    public get Pm25(): number
    {
        return this.out.pm25 / 10;
    }
    
    public get Pm10(): number
    {
        return this.out.pm10 / 10;
    }

    private out: ParserData = <ParserData>{};
    private serial: Serial = new Serial();
    private onUpdateCallback?: (pm10: number, pm25: number) => void;

    public async Disconnect(): Promise<void>
    {
        await this.serial.Disconnect();
    }

    public Connect(port: string, onConnectionCallback?: () => void): void
    {
        this.serial.OnConnection(() =>
        {
            if (onConnectionCallback)
                onConnectionCallback();
        });

        this.serial.OnData((data) =>
        {
            data.forEach(b => parser.Parse(b));
        });

        const parserBuilder = new FluentParserBuilder<ParserData>();
        const parser = parserBuilder
            .Is(0xAA).Is(0xC0)
            .Get2LE('pm25').Get2LE('pm10')
            .Any().Any().Any()
            .Is(0xAB)
            .Build();

        parser.OnComplete((out: ParserData) =>
        {
            this.out = out;

            if (this.onUpdateCallback)
                this.onUpdateCallback(out.pm10, out.pm25);
        });

        let faultsCounter = 0;
        parser.OnFault((reason, frame) =>
        {
            faultsCounter++;

            console.log(`FAULT ${ faultsCounter }: ${ reason }`);
        });

        this.serial.Connect(port, 9600);
    }

    public OnUpdate(callback: (pm10: number, pm25: number) => void): void
    {
        this.onUpdateCallback = callback;
    }
}
