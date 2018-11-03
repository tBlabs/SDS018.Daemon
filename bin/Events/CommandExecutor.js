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
const ProcessRunner_1 = require("./Runners/ProcessRunner");
const HttpRunner_1 = require("./Runners/HttpRunner");
var CommandType;
(function (CommandType) {
    CommandType[CommandType["HttpGet"] = 0] = "HttpGet";
    CommandType[CommandType["Bash"] = 1] = "Bash";
})(CommandType || (CommandType = {}));
let CommandExecutor = class CommandExecutor {
    constructor(_httpRunner, _processRunner) {
        this._httpRunner = _httpRunner;
        this._processRunner = _processRunner;
    }
    DetermineCommandType(cmd) {
        if (cmd.startsWith('GET:'))
            return CommandType.HttpGet;
        if (cmd.startsWith('BASH:'))
            return CommandType.Bash;
        return CommandType.HttpGet;
    }
    RemoveCommandTypeMarker(cmd) {
        return cmd.replace('GET:', '').replace('BASH:', '');
    }
    async Execute(cmd) {
        const commandType = this.DetermineCommandType(cmd);
        cmd = this.RemoveCommandTypeMarker(cmd);
        switch (commandType) {
            case CommandType.HttpGet:
                await this._httpRunner.Exe(cmd);
                break;
            case CommandType.Bash:
                await this._processRunner.Exe(cmd);
                break;
        }
    }
};
CommandExecutor = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [HttpRunner_1.HttpRunner,
        ProcessRunner_1.ProcessRunner])
], CommandExecutor);
exports.CommandExecutor = CommandExecutor;
//# sourceMappingURL=CommandExecutor.js.map