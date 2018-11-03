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
const Types_1 = require("../IoC/Types");
const IOsConfig_1 = require("../Storage/IOsConfig");
const Event_1 = require("./../Events/Event");
let IoConfigController = class IoConfigController {
    constructor(_server, _iosConfig) {
        this._server = _server;
        this._iosConfig = _iosConfig;
    }
    RegisterRoutes() {
        this._server.all('/IoConfig', (req, res) => {
            res.send(this._iosConfig.Entries);
        });
        const ioNameRegexString = '[a-z.0-9_\-]{1,100}';
        const eventsRegexString = Object.keys(Event_1.Event).join('|');
        const eventCommandRegexString = '[a-z.0-9%_/:{}\-]+'; // % must be there because browser will turn { sign into %7B and there is no way to prevent it
        this._server.all(new RegExp('^/(' + ioNameRegexString + ')/(' + eventsRegexString + ')/(' + eventCommandRegexString + ')$', 'i'), (req, res) => {
            const ioName = req.params[0];
            const eventName = req.params[1];
            const command = req.params[2];
            this._iosConfig.UpdateEvent(ioName, eventName, command);
            res.sendStatus(200);
        });
        this._server.all(new RegExp('^/(' + ioNameRegexString + ')/(' + eventsRegexString + ')/$', 'i'), (req, res) => {
            const ioName = req.params[0];
            const eventName = req.params[1];
            this._iosConfig.DeleteEvent(ioName, eventName);
            res.sendStatus(200);
        });
        this._server.all('/:ioName/rename/:to', (req, res) => {
            const ioName = req.params.ioName;
            const newName = req.params.to;
            this._iosConfig.Rename(ioName, newName);
            res.sendStatus(200);
        });
    }
};
IoConfigController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ExpressServer)),
    __metadata("design:paramtypes", [Object, IOsConfig_1.IOsConfig])
], IoConfigController);
exports.IoConfigController = IoConfigController;
//# sourceMappingURL=IoConfigController.js.map