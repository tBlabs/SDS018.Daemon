import axios from 'axios';
import { IoState } from "./IoState";
import { Config } from './Config';
import { injectable } from 'inversify';

@injectable()
export class CommandResolver
{
    constructor(private _config: Config) 
    { }

    public Resolve(eventName, cmd, ioState: IoState): string
    {
        cmd = this._config.ApplyOnString(cmd);

        cmd = cmd
            .replace("{this.event}", eventName)
            .replace("{this.value}", ioState.currentValue.toString())
            .replace("{this.previousValue}", ioState.previousValue.toString())
            .replace("{this.event}", eventName)
            .replace("{this.addr}", ioState.addr.toString());

        return cmd;
    }
}