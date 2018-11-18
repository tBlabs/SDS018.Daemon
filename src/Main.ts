import 'reflect-metadata';
import { injectable } from 'inversify';
import { IoState } from './Driver/IoState';
import { Driver } from './Driver/Driver';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { Clients } from './Clients';
import { Config } from './Config';
import { Logger } from './services/logger/Logger';

@injectable()
export class Main
{
    constructor(
        private _config: Config,
        private _driver: Driver,
        private _logger: Logger)
    { }

    public async Run(): Promise<void>
    {
        const server = express();
        const httpServer = http.createServer(server);
        const socket = socketIo(httpServer);
        const clients = new Clients();

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.all('/ping', (req, res) =>
        {
            this._logger.Log('PING');
            res.send('pong');
        });

        server.all('/:addr', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);

            const value = this._driver.Read(addr);

            this._logger.Log(`HTTP | ${ addr }: ${ value }`);

            res.send(value.toString());
        });

        server.all('/:addr/:value', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);

            this._logger.Log(`HTTP | ${ addr } = ${ value }`);

            this._driver.Set(addr, value);

            res.sendStatus(202);
        });

        server.use((err, req, res, next) =>
        {
            this._logger.Log(`Globally caught server error: ${ err.message }`);

            res.send(err.message);
        });


        socket.on('error', (e) => this._logger.Log(`SOCKET ERROR ${ e }`));

        socket.on('connection', (socket: Socket) =>
        {
            clients.Add(socket);

            socket.on('get', (addr) =>
            {
                try
                {
                    const value = this._driver.Read(addr);
                    this._logger.Log(`SOCKET | ${ addr }: ${ value }`);

                    socket.emit('update', addr, value);
                }
                catch (error)
                {
                    this._logger.Log(`DRIVER ERROR ${ error.message }`);

                    socket.emit('driver-error', error.message);
                }
            });

            socket.on('get-all', () =>
            {
                const state = this._driver.State;

                socket.emit('update-all', state);
            });

            socket.on('set', (addr, value) =>
            {
                try
                {
                    this._logger.Log(`SOCKET | ${ addr } = ${ value }`);

                    this._driver.Set(addr, value);
                }
                catch (error)
                {
                    this._logger.Log(`DRIVER ERROR ${ error.message }`);

                    socket.emit('driver-error', error.message);
                }
            });
        });


        this._driver.OnUpdate((ioState: IoState) =>
        {
            clients.SendToAll('update', ioState);
        });


        const port = this._config.Port;
        const serial = this._config.Serial;

        httpServer.listen(port, () => this._logger.LogAlways(`SERVER STARTED @ ${ port }`));
        this._driver.Connect(serial, () => this._logger.LogAlways(`BOARD CONNECTED @ ${ serial }`));


        process.on('SIGINT', async () =>
        {
            clients.DisconnectAll();

            await this._driver.Disconnect();
            this._logger.LogAlways(`BOARD DISCONNECTED`);
            
            httpServer.close(() => this._logger.LogAlways(`SERVER CLOSED`));
        });
    }
}
