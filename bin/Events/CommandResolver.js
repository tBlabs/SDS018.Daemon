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
const UserConfig_1 = require("../Storage/UserConfig");
let CommandResolver = class CommandResolver {
    constructor(_config) {
        this._config = _config;
    }
    Resolve(eventName, cmd, ioState, ioName) {
        cmd = this._config.ApplyOnString(cmd);
        // Second resolve (for variables of variables)
        cmd = this._config.ApplyOnString(cmd);
        cmd = cmd
            .replace("{this.value}", ioState.currentValue.toString())
            .replace("{this.name}", ioName)
            .replace("{this.event}", eventName)
            .replace("{this.previousValue}", ioState.previousValue.toString())
            .replace("{this.addr}", ioState.addr.toString())
            .replace("{this.timestamp}", ioState.currentValueUpdateTimestamp.toString())
            .replace("{this.previousTimestamp}", ioState.previousValueUpdateTimestamp.toString());
        return cmd;
    }
};
CommandResolver = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [UserConfig_1.UserConfig])
], CommandResolver);
exports.CommandResolver = CommandResolver;
//# sourceMappingURL=CommandResolver.js.map