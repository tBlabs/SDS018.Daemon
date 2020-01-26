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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const Driver_1 = require("./Driver/Driver");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Clients_1 = require("./Clients");
const Config_1 = require("./Config");
const Logger_1 = require("./services/logger/Logger");
let Main = class Main {
    constructor(_config, _driver, _logger) {
        this._config = _config;
        this._driver = _driver;
        this._logger = _logger;
    }
    async Run() {
        const server = express();
        const httpServer = http.createServer(server);
        const socket = socketIo(httpServer);
        const clients = new Clients_1.Clients();
        server.get('/favicon.ico', (req, res) => res.status(204));
        server.all('/', (req, res) => {
            const pm10 = this._driver.Pm10;
            const pm25 = this._driver.Pm25;
            res.send(`SDS018 | PM 10: ${pm10} | PM 2.5: ${pm25}`);
        });
        server.all('/ping', (req, res) => {
            this._logger.Log('PING');
            res.send('pong');
        });
        server.all('/pm25', (req, res) => {
            const value = this._driver.Pm25;
            this._logger.Log(`HTTP | pm25: ${value}`);
            res.send(value.toString());
        });
        server.all('/pm10', (req, res) => {
            const value = this._driver.Pm10;
            this._logger.Log(`HTTP HIT | pm10: ${value}`);
            res.send(value.toString());
        });
        server.use((err, req, res, next) => {
            this._logger.Log(`Globally caught server error: ${err.message}`);
            res.send(err.message);
        });
        socket.on('error', (e) => this._logger.Log(`SOCKET ERROR ${e}`));
        socket.on('connection', (socket) => {
            clients.Add(socket);
            socket.on('get', () => {
                const pm10 = this._driver.Pm10;
                const pm25 = this._driver.Pm25;
                socket.emit('update', pm10, pm25);
            });
        });
        this._driver.OnUpdate((pm10, pm25) => {
            if (this._config.Talk) {
                console.log(`PM 2.5: ${(pm25 / 10).toFixed(1)} | PM 10: ${(pm10 / 10).toFixed(1)}`);
            }
            clients.SendToAll('update', pm10, pm25);
        });
        const port = this._config.Port;
        httpServer.listen(port, () => this._logger.LogAlways(`SERVER STARTED @ ${port}`));
        const serial = this._config.Serial;
        this._driver.Connect(serial, () => {
            this._logger.LogAlways(`SENSOR CONNECTED @ ${serial}`);
            const pm10 = this._driver.Pm10;
            const pm25 = this._driver.Pm25;
            // this._logger.Log(`SDS018 | PM 10: ${ pm10 } | PM 2.5: ${ pm25 }`);
        });
        process.on('SIGINT', async () => {
            clients.DisconnectAll();
            await this._driver.Disconnect();
            this._logger.LogAlways(`BOARD DISCONNECTED`);
            httpServer.close(() => this._logger.LogAlways(`SERVER CLOSED`));
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Config_1.Config,
        Driver_1.Driver,
        Logger_1.Logger])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map