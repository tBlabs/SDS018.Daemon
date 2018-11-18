import { injectable } from "inversify";
import { Config } from "../../Config";

@injectable()
export class Logger
{
    constructor(private _config: Config)
    { }

    public Log(text: string): void
    {
        if (this._config.Log)
        {
            console.log(text);
        }
    }

    public LogAlways(text: string): void
    {
        console.log(text);
    }
}