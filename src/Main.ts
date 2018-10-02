import { IRunMode } from './services/runMode/IRunMode';
import { ILogger } from './services/logger/ILogger';
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import { IStartupArgs } from './services/environment/IStartupArgs';
import * as express from 'express';
import { Driver } from './Driver';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IRunMode) private _runMode: IRunMode,
        private _driver: Driver)
    { }

    public async Run(): Promise<void>
    {
        const server = express();

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.all('/:addr', (req, res) =>
        {
            const addr =  parseInt(req.params.addr);
            console.log('get', addr);

            const value = this._driver.Read(addr);
            console.log(value);
            res.send(value.toString());
        });

        server.all('/:addr/:value', (req, res) =>
        {
            const addr = parseInt(req.params.addr);
            const value = parseInt(req.params.value);

            this._driver.Set(addr, value);

            res.sendStatus(200);
        });

        server.all('/ping', (req, res) =>
        {
            this._driver.Ping();

            res.status(200).send('pong');
        });

        server.listen(3000, () => console.log('RDY'));

        // this._driver.Connect(this._args.Args.port);
        this._driver.Connect('/dev/ttyUSB0');
    }
}
