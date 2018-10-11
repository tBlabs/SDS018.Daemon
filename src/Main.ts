import { IRunMode } from './services/runMode/IRunMode';
import { ILogger } from './services/logger/ILogger';
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import { IStartupArgs } from './services/environment/IStartupArgs';
import * as express from 'express';
import { Driver } from './Driver';
import axios from 'axios';
import * as fs from 'fs';

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

        server.all('/ping', (req, res) =>
        {
            this._driver.Ping();

            res.status(200).send('http pong (not from board)');
        });

        server.all('/info', (req, res) =>
        {
            res.status(200).send(this._driver.Info);
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
        const corePort = 3001;

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
        const config = JSON.parse(configFileContent);
        // console.log(config);
        
        this._driver.OnUpdate(async (addr, previousValue, currentValue) =>
        {
            console.log(`${addr}: ${previousValue} --> ${currentValue}`);
            
            if (config[addr.toString()])
            {
                let url = config[addr.toString()].onChange;

                url = url.replace("{this.addr}", addr.toString())
                    .replace("{this.value}", currentValue.toString())
                    .replace("{this.previousValue}", previousValue.toString());

                await axios.get(url);
            }
            try
            {
                // const url = `http://localhost:${ corePort }/update/${ boardDriverPort }/${ addr }/${ currentValue }`;
                // console.log(url);
                // await axios.get(url); // TODO: move to config
            } 
            catch (error)
            {
                console.log(error.message);
            }
        });
        
         this._driver.Connect('/dev/ttyUSB0'); // TODO: move to config
    }
}
