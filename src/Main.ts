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

@injectable()
export class Main
{
    constructor(
        private _config: Config,
        private _driver: Driver)
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
            console.log('PING');
            res.send('pong');
        });

        server.all('/:addr', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);

            const value = this._driver.Read(addr);

            console.log(`HTTP | ${ addr }: ${ value }`);

            res.send(value.toString());
        });

        server.all('/:addr/:value', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);

            console.log(`HTTP | ${ addr } = ${ value }`);

            this._driver.Set(addr, value);

            res.sendStatus(202);
        });

        server.use((err, req, res, next) =>
        {
            console.log('Globally caught server error:', err.message);

            res.send(err.message);
        });


        socket.on('error', (e) => console.log('SOCKET ERROR', e));

        socket.on('connection', (socket: Socket) =>
        {
            clients.Add(socket);

            socket.on('get', (addr) =>
            {
                try
                {
                    const value = this._driver.Read(addr);
                    console.log(`SOCKET | ${ addr }: ${ value }`);

                    socket.emit('update', addr, value);
                }
                catch (error)
                {
                    console.log(`DRIVER ERROR ${ error.message }`);

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
                    console.log(`SOCKET | ${ addr } = ${ value }`);

                    this._driver.Set(addr, value);
                }
                catch (error)
                {
                    console.log(`DRIVER ERROR ${ error.message }`);

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

        httpServer.listen(port, () => console.log(`SERVER STARTED @ ${ port }`));
        this._driver.Connect(serial);


        process.on('SIGINT', async () =>
        {
            clients.DisconnectAll();
            httpServer.close(() => console.log('SERVER CLOSED'));
            await this._driver.Disconnect();
        });
    }
}
