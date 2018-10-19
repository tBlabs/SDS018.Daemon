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
import { IoEvents } from './IoEvents';
import { UserConfig } from './UserConfig';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        private _iosConfig: IOsConfig,
        private _userConfig: UserConfig,
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
            console.log(this._iosConfig.Entries);
            res.send(this._iosConfig.Entries);
        });

        server.all('/config', (req, res) =>
        {
            res.send(this._userConfig.ToString());
        });

        server.all(/^\/config\/([a-z0-9_\-]+)\/$/, (req, res) =>
        {
            const key = req.params[0];

            this._userConfig.Delete(key);

            res.sendStatus(200);
        });

        const ioNameRegexString = '[a-z.0-9_\-]{1,100}';
        const eventsRegexString = Object.keys(Event).join('|');
        const eventCommandRegexString = '[a-z.0-9%_/:{}\-]+';

        server.all(new RegExp('^/(' + ioNameRegexString + ')/(' + eventsRegexString + ')/(' + eventCommandRegexString + ')$', 'i'), (req, res) =>
        {
            const ioName = req.params[0];
            const eventName = req.params[1];
            const command = req.params[2];

            console.log(ioName, eventName, command);
            this._iosConfig.UpdateEvent(ioName, eventName, command);
            // res.send(req.params[0] + ' | ' + req.params[1] + ' | ' + req.params[2] );
            res.sendStatus(200);
        });

        server.all(/^\/config\/([a-z0-9_\-]+)\/([a-z0-9_/:%\-]+)$/, (req, res) =>
        {
            const key = req.params[0];
            const value = req.params[1];
            // const queryObj = req.query; // TODO: handling for "?foo=bar"

            this._userConfig.AddOrUpdate(key, value);

            res.send(key + "=" + value);
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

        // TODO: toggle is not possible because state of actuator can not be read from board
        // server.all('/:ioName/toggle', (req, res) =>
        // {
        //     const ioName = req.params.ioName;
        //     const addr = this._iosConfig.AddrByName(ioName);
        //     const currentValue = this._driver.Read(addr);
        //     this._driver.Set(addr, 1 - currentValue);

        //     res.sendStatus(202);
        // });
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
            console.log('Globally catched error:', err.message);

            res.send(err.message);
        });

        const boardDriverPort = 3000;

        server.listen(boardDriverPort, async () => 
        {
            console.log('SERVER STARTED');
        }); // TODO: move to config

        this._driver.OnUpdate((ioState: IoState) =>
        {
            this.EventsExecutor(ioState);
        });

        // this._driver.Connect(this._args.Args.port);
       this._driver.Connect('/dev/ttyUSB0'); // TODO: move to config
    }

    private EventsExecutor(ioState: IoState)
    {
        const ioAddr: number = ioState.addr;
        const ioEvents: IoEvents = this._iosConfig.IoEvents(ioAddr);
        const eventsToExecute: Event[] = this._eventsDeterminator.Determine(ioEvents, ioState);

        if (eventsToExecute.length > 0)
            console.log(`${ ioState.addr }: ${ ioState.previousValue } --> ${ ioState.currentValue }`);

        eventsToExecute.forEach(async (eventName: Event) =>
        {
            const rawCommand: Command = ioEvents[eventName];
            const commandToExecute = this._commandResolver.Resolve(eventName, rawCommand, ioState);
            console.log('  ', eventName, commandToExecute);
            await this._commandExecutor.Execute(commandToExecute);
        });
    }
}
