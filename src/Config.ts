import { injectable } from "inversify";
import { StartupArgs } from "./services/env/StartupArgs";
import { Environment } from "./services/env/Environment";

@injectable()
export class Config
{
    constructor(
        private _env: Environment,
        private _args: StartupArgs)
    { }

    public get Port(): string
    {
        return this._args.Args.Port || this._args.Args.port || 3000;
    }

    public get Serial(): string
    {
        const serialFromArgs = this._args.Args.Serial || this._args.Args.serial;

        if (serialFromArgs === undefined)
        {
            if (this._env.ValueOf('TARGET') === 'PC') return this._env.ValueOf('PC_SERIAL');
            if (this._env.ValueOf('TARGET') === 'RPI') return this._env.ValueOf('RPI_SERIAL');
        }

        return serialFromArgs;
    }
}