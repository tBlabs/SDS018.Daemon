import 'reflect-metadata';
import { injectable } from 'inversify';
import { IoState } from './Driver/IoState';
import { Driver } from './Driver/Driver';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { Addr } from './Driver/Addr';
import { StartupArgs } from './services/environment/StartupArgs';

@injectable()
export class Main
{
    constructor(
        private _args: StartupArgs,
        private _driver: Driver)
    { }

    public async Run(): Promise<void>
    {
        const server = express();
        const httpServer = http.createServer(server);
        const socket = socketIo(httpServer);

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.all('/ping', (req, res) =>
        {
            res.send('pong');
        });

        server.all('/:addr', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);

            const value = this._driver.Read(addr);

            res.send(value.toString());
        });

        server.all('/:addr/:value', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);

            this._driver.Set(addr, value);

            res.sendStatus(202);
        });

        server.use((err, req, res, next) =>
        {
            console.log('Globally caught server error:', err.message);

            res.send(err.message);
        });


        const clients: Socket[] = [];


        socket.on('connection', (socket: Socket) =>
        {
            console.log('client connected', socket.id);
            clients.push(socket);

            socket.on('disconnect', () =>
            {
                // console.log('disconnected', socket.id);
                const clientIndex = clients.indexOf(socket);

                clients.splice(clientIndex, 1);
            })

            socket.on('get', (addr) =>
            {
                const value = this._driver.Read(addr);

                socket.emit('update', addr, value);
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
                    this._driver.Set(addr, value);
                }
                catch (error)
                {
                    console.log(error.message);
                    socket.emit('error', error.message);
                }
            });
        });

        this._driver.OnUpdate((ioState: IoState) =>
        {
            if (ioState.addr === Addr.RTC) return;

            clients.forEach((socket: Socket) =>
            {
                socket.emit('update', ioState);
            });
        });

        const port = this._args.Args.port || 3000;
        httpServer.listen(port, () => console.log(`SERVER STARTED @ ${port}`));

        const usb = this._args.Args.usb || '/dev/ttyUSB1';
        this._driver.Connect(usb);

        process.on('SIGINT', () =>
        {
            httpServer.close(() => console.log('SERVER CLOSED'));
            this._driver.Disconnect();
        });
    }
}
