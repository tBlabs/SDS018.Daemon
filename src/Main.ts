import { IRunMode } from './services/runMode/IRunMode';
import { ILogger } from './services/logger/ILogger';
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import { IStartupArgs } from './services/environment/IStartupArgs';
import * as express from 'express';
import { Driver } from './Driver';
import * as fs from 'fs';
import { IoState } from "./IoState";
import { exec } from 'child_process';
import { IoConfig } from './CommandRunner';
import { Event } from './Event';
import { EventsDeterminator } from './EventsDeterminator';
import { CommandResolver } from './CommandResolver';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IRunMode) private _runMode: IRunMode,
        private _eventsDeterminator: EventsDeterminator,
        private _executor: CommandResolver,
        private _driver: Driver)
    { }

    public async Run(): Promise<void>
    {
        const server = express();

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.all('/ping', (req, res) =>
        {
            this._driver.Ping();

            res.status(200).send('http pong (not from board)');
        });

        server.all('/info', (req, res) =>
        {
            res.status(200).send(this._driver.Info);
        });

        // server.param('value', /^[a-z0-9]+$/);
        server.all(/^\/config\/([a-z0-9_\-]+)\/([\/\-a-z0-9:?]+)$/, (req, res) =>
        {
            const key = req.params[0];
            const value = req.params[1];

            // res.status(200).send(key+"="+value+", "+JSON.stringify(req.query));
            res.status(200).send(key + "=" + value + ", " + req.query.toString());
        });

        server.all('/:addr', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr);

            try
            {
                const value = this._driver.Read(addr);

                res.send(value.toString());
            }
            catch (error)
            {
                res.status(404).send(error.message);
            }
        });

        server.all('/:addr/:value', (req, res) =>
        {
            const addr = parseInt(req.params.addr);
            const value = parseInt(req.params.value);

            this._driver.Set(addr, value);

            res.sendStatus(200);
        });

        const boardDriverPort = 3000;

        server.listen(boardDriverPort, async () => 
        {
            console.log('SERVER STARTED');

            // try
            // {
            //     const url = `http://localhost:${ corePort }/register/${ boardDriverPort }`;
            //     console.log(url);
            //     await axios.get(url, { data: this._driver.Info }); // TODO: move to config
            // } catch (error)
            // {
            //     console.log(error.message);
            // }
        }); // TODO: move to config

        // this._driver.Connect(this._args.Args.port);

        const configFileContent = fs.readFileSync('./src/io.config.json', 'utf8');
        const iosConfig: { [key: string]: IoConfigStruct } = JSON.parse(configFileContent);
        // console.log(config);


        this._driver.OnUpdate((ioState: IoState) =>
        {
            if (ioState.addr == 7) return;
            console.log(`${ ioState.addr }: ${ ioState.previousValue } --> ${ ioState.currentValue }`);

            // EventExecutor(ioConfig, ioState)
            const ioAddr = ioState.addr;
            const ioConfig = iosConfig[ioAddr];

            if (ioConfig === undefined) return;

            const eventsToExecute: Event[] = this._eventsDeterminator.Determine(ioConfig.events, ioState);

            eventsToExecute.forEach((eventName: Event) =>
            {
                const command: Command = ioConfig.events[eventName];
                console.log('  ', eventName, ':', command);
                this._executor.Resolve(eventName, command, ioState);
            });
        });

        this._driver.Connect('/dev/ttyUSB0'); // TODO: move to config
    }
}

export type Command = string;
export type IoEvents = {
    [key in Event]: Command;
};

export interface IoConfigStruct
{
    name: string;
    events: IoEvents;
}


