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
const StartupArgs_1 = require("./services/environment/StartupArgs");
const Clients_1 = require("./Clients");
let Main = class Main {
    constructor(_args, _driver) {
        this._args = _args;
        this._driver = _driver;
    }
    async Run() {
        const server = express();
        const httpServer = http.createServer(server);
        const socket = socketIo(httpServer);
        server.get('/favicon.ico', (req, res) => res.status(204));
        server.all('/ping', (req, res) => {
            console.log('ping');
            res.send('pong');
        });
        server.all('/:addr', (req, res) => {
            const addr = parseInt(req.params.addr, 10);
            const value = this._driver.Read(addr);
            console.log(`${addr}: ${value}`);
            res.send(value.toString());
        });
        server.all('/:addr/:value', (req, res) => {
            const addr = parseInt(req.params.addr, 10);
            const value = parseInt(req.params.value, 10);
            console.log(`${addr} = ${value}`);
            this._driver.Set(addr, value);
            res.sendStatus(202);
        });
        server.use((err, req, res, next) => {
            console.log('Globally caught server error:', err.message);
            res.send(err.message);
        });
        const clients = new Clients_1.Clients();
        socket.on('connection', (socket) => {
            clients.Add(socket);
            socket.on('get', (addr) => {
                const value = this._driver.Read(addr);
                socket.emit('update', addr, value);
            });
            socket.on('get-all', () => {
                const state = this._driver.State;
                socket.emit('update-all', state);
            });
            socket.on('set', (addr, value) => {
                try {
                    this._driver.Set(addr, value);
                }
                catch (error) {
                    console.log(error.message);
                    socket.emit('error', error.message);
                }
            });
        });
        this._driver.OnUpdate((ioState) => {
            clients.SendToAll('update', ioState);
        });
        const port = this._args.Args.port || 3000;
        const usb = this._args.Args.usb || '/dev/ttyUSB0';
        httpServer.listen(port, () => console.log(`SERVER STARTED @ ${port}`));
        this._driver.Connect(usb);
        process.on('SIGINT', async () => {
            clients.DisconnectAll();
            httpServer.close(() => console.log('SERVER CLOSED'));
            await this._driver.Disconnect();
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [StartupArgs_1.StartupArgs,
        Driver_1.Driver])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map