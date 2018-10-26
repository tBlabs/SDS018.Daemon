import { injectable, inject, multiInject } from 'inversify';
import { Types } from './IoC/Types';
import { Driver } from './Driver/Driver';
import { IoState } from "./IoState";
import { AppConfig } from './Storage/AppConfig';
import { EventsExecutor } from './Events/EventsExecutor';
import { IController } from './Controllers/UserConfigController';

@injectable()
export class Main
{
    constructor(
        private _appConfig: AppConfig,
        @inject(Types.ExpressServer) private _server,        
        @multiInject(Types.IController) private _controllers: IController[],
        private _driver: Driver,
        private _eventsExecutor: EventsExecutor)
    { }

    public async Run(): Promise<void>
    {
        this._server.get('/favicon.ico', (req, res) => res.status(204));

        this._server.all('/ping', (req, res) =>
        {
            res.send('pong');
        });

        // Kolejność rutów ma znaczenie!!!!!
        this._controllers.forEach(c=>c.RegisterRoutes());

        this._server.use((err, req, res) =>
        {
            console.log('Globally caught server error:', err.message);

            res.send(err.message);
        });

        this._server.listen(this._appConfig.Host, async () => 
        {
            console.log('SERVER STARTED @', this._appConfig.Host);
        });


        this._driver.OnUpdate((ioState: IoState) =>
        {
            this._eventsExecutor.Execute(ioState);
        });

        this._driver.Connect(this._appConfig.Usb);
    }
}
