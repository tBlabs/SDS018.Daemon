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
const UserConfig_1 = require("../Storage/UserConfig");
const Types_1 = require("../IoC/Types");
let UserConfigController = class UserConfigController {
    constructor(_server, _userConfig) {
        this._server = _server;
        this._userConfig = _userConfig;
    }
    RegisterRoutes() {
        this._server.all('/config', (req, res) => {
            res.send(this._userConfig.ToString());
        });
        const commandRegexString = '[a-z.0-9%_/:{}\-]+'; // % must be there because browser will turn { sign into %7B and there is no way to prevent it
        this._server.all(new RegExp('^/config/([a-z0-9_\-]+)/(' + commandRegexString + ')$', 'i'), (req, res) => {
            const key = req.params[0];
            const value = req.params[1];
            this._userConfig.AddOrUpdate(key, value);
            res.send(key + "=" + value);
        });
        this._server.all(/^\/config\/([a-z0-9_\-]+)\/$/, (req, res) => {
            const key = req.params[0];
            this._userConfig.Delete(key);
            res.sendStatus(200);
        });
    }
};
UserConfigController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ExpressServer)),
    __metadata("design:paramtypes", [Object, UserConfig_1.UserConfig])
], UserConfigController);
exports.UserConfigController = UserConfigController;
//# sourceMappingURL=UserConfigController.js.map