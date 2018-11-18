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
const inversify_1 = require("inversify");
const StartupArgs_1 = require("./services/env/StartupArgs");
const Environment_1 = require("./services/env/Environment");
let Config = class Config {
    constructor(_env, _args) {
        this._env = _env;
        this._args = _args;
    }
    get Port() {
        return this._args.Args.Port || this._args.Args.port || 3000;
    }
    get Serial() {
        const serialFromArgs = this._args.Args.Serial || this._args.Args.serial;
        if (serialFromArgs === undefined) {
            if (this._env.ValueOf('TARGET') === 'PC')
                return this._env.ValueOf('PC_SERIAL');
            if (this._env.ValueOf('TARGET') === 'RPI')
                return this._env.ValueOf('RPI_SERIAL');
        }
        return serialFromArgs;
    }
};
Config = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Environment_1.Environment,
        StartupArgs_1.StartupArgs])
], Config);
exports.Config = Config;
//# sourceMappingURL=Config.js.map