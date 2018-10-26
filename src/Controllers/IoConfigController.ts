import { injectable, inject } from "inversify";
import { Types } from "../IoC/Types";
import { IOsConfig } from "../IOsConfig";
import { Event } from './Event';

@injectable()
export class IoConfigController implements IController
{
    constructor(
        @inject(Types.ExpressServer) private _server,
        private _iosConfig: IOsConfig)
    { }

    public RegisterRoutes()
    {
        this._server.all('/ioConfig', (req, res) =>
        {
            res.send(this._iosConfig.Entries);
        });

        const ioNameRegexString = '[a-z.0-9_\-]{1,100}';
        const eventsRegexString = Object.keys(Event).join('|');
        const eventCommandRegexString = '[a-z.0-9%_/:{}\-]+'; // % must be there because browser will turn { sign into %7B and there is no way to prevent it

        this._server.all(new RegExp('^/(' + ioNameRegexString + ')/(' + eventsRegexString + ')/(' + eventCommandRegexString + ')$', 'i'), (req, res) =>
        {
            const ioName = req.params[0];
            const eventName = req.params[1];
            const command = req.params[2];

            this._iosConfig.UpdateEvent(ioName, eventName, command);

            res.sendStatus(200);
        });

        this._server.all(new RegExp('^/(' + ioNameRegexString + ')/(' + eventsRegexString + ')/$', 'i'), (req, res) =>
        {
            const ioName = req.params[0];
            const eventName = req.params[1];

            this._iosConfig.DeleteEvent(ioName, eventName);

            res.sendStatus(200);
        });

        this._server.all('/:ioName/rename/:to', (req, res) =>
        {
            const ioName = req.params.ioName;
            const newName = req.params.to;

            this._iosConfig.Rename(ioName, newName);

            res.sendStatus(200);
        });
    }
}
