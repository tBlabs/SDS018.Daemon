"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const IoConfig_1 = require("../Storage/IoConfig");
const inversify_1 = require("inversify");
const Types_1 = require("../IoC/Types");
const Driver_1 = require("../Driver/Driver");
let DriverController = class DriverController {
    constructor(_server, _driver, _iosConfig) {
        this._server = _server;
        this._driver = _driver;
        this._iosConfig = _iosConfig;
    }
    RegisterRoutes() {
        this._server.all('/BoardInfo', (req, res) => {
            res.send(this._driver.Info);
        });
        this._server.all('/IoState', (req, res) => {
            const report = {};
            for (let addr = 0; addr < this._driver.IoCount; addr++) {
                const ioName = this._iosConfig.IoNameByAddr(addr).replace('-', '_');
                report[ioName] = this._driver.Read(addr);
            }
            res.send(report);
        });
        this._server.all('/get/:addr', (req, res) => {
            const addr = parseInt(req.params.addr, 10);
            const value = this._driver.Read(addr);
            res.send(value.toString());
        });
        this._server.all('/set/:addr/:value', (req, res) => {
            const addr = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);
            this._driver.Set(addr, value);
            res.sendStatus(202);
        });
        this._server.all('/:ioName', (req, res) => {
            const ioName = req.params.ioName;
            const addr = this._iosConfig.AddrByName(ioName);
            const value = this._driver.Read(addr);
            res.send(value.toString());
        });
        this._server.all('/:ioName/:value', (req, res) => {
            const ioName = req.params.ioName;
            const value = req.params.value;
            const addr = this._iosConfig.AddrByName(ioName);
            console.log(`${ioName} = ${value}`);
            this._driver.Set(addr, value);
            res.sendStatus(202);
        });
    }
};
DriverController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ExpressServer)),
    __metadata("design:paramtypes", [Object, Driver_1.Driver,
        IoConfig_1.IoConfig])
], DriverController);
exports.DriverController = DriverController;
//# sourceMappingURL=DriverController.js.map