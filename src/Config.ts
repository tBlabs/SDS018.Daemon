import { injectable } from "inversify";
import { StartupArgs } from "./services/env/StartupArgs";

@injectable()
export class Config
{
    constructor(
        private _args: StartupArgs)
    { }

    public get Port(): number
    {
        const portFromArgs = this._args.Args.port;

        if (portFromArgs === undefined)
        {
            throw new Error(`No "port" defined (example: "--port 3000")`);
        }

        return portFromArgs;
    }

    public get Serial(): string
    {
        const serialFromArgs = this._args.Args.serial;

        if (serialFromArgs === undefined)
        {
            throw new Error(`No "serial" defined (example: "--serial /dev/ttyUSB0" or "--serial /dev/ttyS0")`);
        }

        return serialFromArgs;
    }

    public get Log(): boolean
    {
        const log = this._args.Args.log || false;

        return log;
    }
}