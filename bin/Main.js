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
        server.all('/ping', (req, res) => {
            this._logger.Log('PING');
            res.send('pong');
        });
        server.all('/iostate', (req, res) => {
            const iosState = this._driver.State;
            let state = {};
            iosState.forEach((io) => state[io.addr] = io.currentValue);
            res.send(state);
        });
        server.all('/:addr', (req, res) => {
            const addr = parseInt(req.params.addr, 10);
            const value = this._driver.Read(addr);
            this._logger.Log(`HTTP | ${addr}: ${value}`);
            res.send(value.toString());
        });
        server.all('/:addr/:value', (req, res) => {
            const addr = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);
            this._logger.Log(`HTTP | ${addr} = ${value}`);
            this._driver.Set(addr, value);
            res.sendStatus(202);
        });
        server.use((err, req, res, next) => {
            this._logger.Log(`Globally caught server error: ${err.message}`);
            res.send(err.message);
        });
        socket.on('error', (e) => this._logger.Log(`SOCKET ERROR ${e}`));
        socket.on('connection', (socket) => {
            clients.Add(socket);
            socket.on('get', (addr) => {
                try {
                    const value = this._driver.Read(addr);
                    this._logger.Log(`SOCKET | ${addr}: ${value}`);
                    socket.emit('update', addr, value);
                }
                catch (error) {
                    this._logger.Log(`DRIVER ERROR ${error.message}`);
                    socket.emit('driver-error', error.message);
                }
            });
            socket.on('get-all', () => {
                const state = this._driver.State;
                socket.emit('update-all', state);
            });
            socket.on('set', (addr, value) => {
                try {
                    this._logger.Log(`SOCKET | ${addr} = ${value}`);
                    this._driver.Set(addr, value);
                }
                catch (error) {
                    this._logger.Log(`DRIVER ERROR ${error.message}`);
                    socket.emit('driver-error', error.message);
                }
            });
        });
        this._driver.OnUpdate((ioState) => {
            clients.SendToAll('update', ioState);
        });
        const port = this._config.Port;
        const serial = this._config.Serial;
        httpServer.listen(port, () => this._logger.LogAlways(`SERVER STARTED @ ${port}`));
        this._driver.Connect(serial, () => this._logger.LogAlways(`BOARD CONNECTED @ ${serial}`));
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