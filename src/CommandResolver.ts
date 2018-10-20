import axios from 'axios';
import { IoState } from "./IoState";
import { UserConfig } from './UserConfig';
import { injectable } from 'inversify';

@injectable()
export class CommandResolver
{
    constructor(private _config: UserConfig) 
    { }

    public Resolve(eventName: string, cmd: string, ioState: IoState, ioName: string): string
    {
        cmd = this._config.ApplyOnString(cmd);
        
        // Second resolve (for variables of variables)
        cmd = this._config.ApplyOnString(cmd); 

        cmd = cmd
            .replace("{this.name}", ioName)
            .replace("{this.event}", eventName)
            .replace("{this.value}", ioState.currentValue.toString())
            .replace("{this.previousValue}", ioState.previousValue.toString())
            .replace("{this.event}", eventName)
            .replace("{this.addr}", ioState.addr.toString())
            .replace("{this.timestamp}", ioState.currentValueUpdateTimestamp.toString())
            .replace("{this.previousTimestamp}", ioState.previousValueUpdateTimestamp.toString());

        return cmd;
    }
}