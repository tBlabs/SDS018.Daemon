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
const inversify_1 = require("inversify");
const Types_1 = require("./IoC/Types");
const Driver_1 = require("./Driver/Driver");
const AppConfig_1 = require("./Storage/AppConfig");
const EventsExecutor_1 = require("./Events/EventsExecutor");
let Main = class Main {
    constructor(_appConfig, _server, _controllers, _driver, _eventsExecutor) {
        this._appConfig = _appConfig;
        this._server = _server;
        this._controllers = _controllers;
        this._driver = _driver;
        this._eventsExecutor = _eventsExecutor;
    }
    async Run() {
        this._server.get('/favicon.ico', (req, res) => res.status(204));
        this._server.all('/ping', (req, res) => {
            res.send('pong');
        });
        this._controllers.forEach(c => c.RegisterRoutes());
        this._server.use((err, req, res, next) => {
            console.log('Globally caught server error:', err.message);
            res.send(err.message);
        });
        this._server.listen(this._appConfig.HostPort, async () => {
            console.log('SERVER STARTED @', this._appConfig.HostPort);
        });
        this._driver.OnUpdate((ioState) => {
            this._eventsExecutor.Execute(ioState);
        });
        this._driver.Connect(this._appConfig.Usb);
        process.on('SIGINT', () => {
            this._server.close(() => console.log('SERVER CLOSED'));
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(Types_1.Types.ExpressServer)),
    __param(2, inversify_1.multiInject(Types_1.Types.IController)),
    __metadata("design:paramtypes", [AppConfig_1.AppConfig, Object, Array, Driver_1.Driver,
        EventsExecutor_1.EventsExecutor])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map