import { IRunMode } from './services/runMode/IRunMode';
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import { IStartupArgs } from './services/environment/IStartupArgs';
import * as express from 'express';
import { Driver } from './Driver';
import * as fs from 'fs';
import { IoState } from "./IoState";
import { Event } from './Event';
import { EventsDeterminator } from './EventsDeterminator';
import { CommandResolver } from './CommandResolver';
import { CommandExecutor } from './Executor';
import { IoConfigStruct } from './IoConfigStruct';
import { Command } from './Command';
import { IOsConfig } from './IOsConfig';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        private _iosConfig: IOsConfig,
        private _eventsDeterminator: EventsDeterminator,
        private _commandResolver: CommandResolver,
        private _commandExecutor: CommandExecutor,
        private _driver: Driver)
    { }

    public async Run(): Promise<void>
    {
        const server = express();

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.all('/ping', (req, res) =>
        {
            this._driver.Ping();

            res.send('http pong (not from board)');
        });

        server.all('/boardinfo', (req, res) =>
        {
            res.send(this._driver.Info);
        });

        server.all('/ioconfig', (req, res) =>
        {
            res.send(this._iosConfig.Entries);
        });

        server.all(/^\/config\/([a-z0-9_\-]+)\/([\/\-a-z0-9:?]+)$/, (req, res) =>
        {
            const key = req.params[0];
            const value = req.params[1];

            // res.status(200).send(key+"="+value+", "+JSON.stringify(req.query));
            res.status(200).send(key + "=" + value + ", " + req.query.toString());
        });

        server.all('/get/:addr', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr);
            const value = this._driver.Read(addr);

            res.send(value.toString());
        });

        server.all('/set/:addr/:value', (req, res) =>
        {
            const addr = parseInt(req.params.addr);
            const value = parseInt(req.params.value);

            this._driver.Set(addr, value);

            res.sendStatus(202);
        });

        server.all('/:ioName/rename/:to', (req, res) =>
        {
            const ioName = req.params.ioName;
            const newName = req.params.to;

            this._iosConfig.Rename(ioName, newName);

            res.sendStatus(200);
        });

        server.all('/:ioName', (req, res) =>
        {
            const ioName = req.params.ioName;
            const addr = this._iosConfig.AddrByName(ioName);
            const value = this._driver.Read(addr);

            res.send(value.toString());
        });

        server.all('/:ioName/:value', (req, res) =>
        {
            const ioName = req.params.ioName;
            const value = req.params.value;
            const addr = this._iosConfig.AddrByName(ioName);
            this._driver.Set(addr, value);

            res.sendStatus(202);
        });

        server.use((err, req, res, next) =>
        {
            console.log('globally catched error', err.message);
            res.send(err.message);
        });

        const boardDriverPort = 3000;

        server.listen(boardDriverPort, async () => 
        {
            console.log('SERVER STARTED');
        }); // TODO: move to config

        this._driver.OnUpdate((ioState: IoState) =>
        {
            // if (ioState.addr == 7) return;
            
            const ioAddr: number = ioState.addr;
            const ioConfig = this._iosConfig.Entries[ioAddr];
            
            if (ioConfig === undefined) return;
            
            const ioEvents = ioConfig.events;
            
            if (ioEvents === undefined) return;
            
            const eventsToExecute: Event[] = this._eventsDeterminator.Determine(ioEvents, ioState);
            
            eventsToExecute.forEach(async (eventName: Event) =>
            {
                const command: Command = ioEvents[eventName];
                // console.log('  ', eventName, ':', command);
                const cmd = this._commandResolver.Resolve(eventName, command, ioState);
                console.log(`${ ioState.addr }: ${ ioState.previousValue } --> ${ ioState.currentValue }`);
                console.log('  ', eventName, cmd);
                await this._commandExecutor.Execute(cmd);
            });
        });

        // this._driver.Connect(this._args.Args.port);
        this._driver.Connect('/dev/ttyUSB0'); // TODO: move to config
    }
}
