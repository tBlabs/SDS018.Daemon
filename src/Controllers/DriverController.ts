import { IOsConfig } from './../Storage/IOsConfig';
import { injectable, inject } from 'inversify';
import { Types } from '../IoC/Types';
import { Driver } from '../Driver/Driver';
import { IController } from './IController';

@injectable()
export class DriverController implements IController
{
    constructor(
        @inject(Types.ExpressServer) private _server,
        private _driver: Driver,
        private _iosConfig: IOsConfig)
    { }

    public RegisterRoutes()
    {
        this._server.all('/BoardInfo', (req, res) =>
        {
            res.send(this._driver.Info);
        });

        this._server.all('/IoState', (req, res) =>
        {
            const report = {};
            for (let addr=0; addr<this._driver.IoCount; addr++)
            {
                const ioName = this._iosConfig.IoNameByAddr(addr).replace('-','_');
                report[ioName] =  this._driver.Read(addr);
            }
            res.send(report);
        });

        this._server.all('/get/:addr', (req, res) =>
        {
            const addr: number = parseInt(req.params.addr, 10);
            const value = this._driver.Read(addr);
  
            res.send(value.toString());
        });

        this._server.all('/set/:addr/:value', (req, res) =>
        {
            const addr = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);

            this._driver.Set(addr, value);

            res.sendStatus(202);
        });

        this._server.all('/:ioName', (req, res) =>
        {
            const ioName = req.params.ioName;
            const addr = this._iosConfig.AddrByName(ioName);
            const value = this._driver.Read(addr);

            res.send(value.toString());
        });

        this._server.all('/:ioName/:value', (req, res) =>
        {
            const ioName = req.params.ioName;
            const value = req.params.value;
            const addr = this._iosConfig.AddrByName(ioName);

            this._driver.Set(addr, value);

            res.sendStatus(202);
        });
    }
}
