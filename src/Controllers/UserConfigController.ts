import { injectable, inject } from "inversify";
import { UserConfig } from "../UserConfig";
import { Types } from "../IoC/Types";

export interface IController
{
    RegisterRoutes(): void;
}

@injectable()
export class UserConfigController implements IController
{
    constructor(
        @inject(Types.ExpressServer) private _server,
        private _userConfig: UserConfig)
    { }

    public RegisterRoutes()
    {
        this._server.all('/config', (req, res) =>
        {
            res.send(this._userConfig.ToString());
        });

        const commandRegexString = '[a-z.0-9%_/:{}\-]+'; // % must be there because browser will turn { sign into %7B and there is no way to prevent it

        this._server.all(new RegExp('^/config/([a-z0-9_\-]+)/(' + commandRegexString + ')$', 'i'), (req, res) =>
        {
            const key = req.params[0];
            const value = req.params[1];

            this._userConfig.AddOrUpdate(key, value);

            res.send(key + "=" + value);
        });

        this._server.all(/^\/config\/([a-z0-9_\-]+)\/$/, (req, res) =>
        {
            const key = req.params[0];

            this._userConfig.Delete(key);

            res.sendStatus(200);
        });
    }
}
