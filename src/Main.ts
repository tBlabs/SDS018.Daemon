import 'reflect-metadata';
import { injectable } from 'inversify';
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

        server.all('/', (req, res) =>
        {
            const pm10 = this._driver.Pm10;
            const pm25 = this._driver.Pm25;

            res.send(`SDS018 | PM 10: ${pm10} | PM 2.5: ${pm25}`);
        });

        server.all('/ping', (req, res) =>
        {
            this._logger.Log('PING');

            res.send('pong');
        });

        server.all('/pm25', (req, res) =>
        {
            const value = this._driver.Pm25;

            this._logger.Log(`HTTP | pm25: ${ value }`);

            res.send(value.toString());
        });

        server.all('/pm10', (req, res) =>
        {
            const value = this._driver.Pm10;

            this._logger.Log(`HTTP HIT | pm10: ${ value }`);

            res.send(value.toString());
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

            socket.on('get', () =>
            {
                const pm10 = this._driver.Pm10;
                const pm25 = this._driver.Pm25;

                socket.emit('update', pm10, pm25);
            });
        });


        this._driver.OnUpdate((pm10, pm25) =>
        {
            clients.SendToAll('update', pm10, pm25);
        });


        const port = this._config.Port;
        httpServer.listen(port, () => this._logger.LogAlways(`SERVER STARTED @ ${ port }`));
        
        const serial = this._config.Serial;
        this._driver.Connect(serial, () => 
        {
            this._logger.LogAlways(`SENSOR CONNECTED @ ${ serial }`);

            const pm10 = this._driver.Pm10;
            const pm25 = this._driver.Pm25;

            this._logger.Log(`SDS018 | PM 10: ${ pm10 } | PM 2.5: ${ pm25 }`);
        });

 
        process.on('SIGINT', async () =>
        {
            clients.DisconnectAll();

            await this._driver.Disconnect();
            this._logger.LogAlways(`BOARD DISCONNECTED`);

            httpServer.close(() => this._logger.LogAlways(`SERVER CLOSED`));
        });
    }
}
