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
const EventsDeterminator_1 = require("./EventsDeterminator");
const CommandResolver_1 = require("./CommandResolver");
const CommandExecutor_1 = require("./CommandExecutor");
const inversify_1 = require("inversify");
const IoConfig_1 = require("../Storage/IoConfig");
let EventsExecutor = class EventsExecutor {
    constructor(_iosConfig, _eventsDeterminator, _commandResolver, _commandExecutor) {
        this._iosConfig = _iosConfig;
        this._eventsDeterminator = _eventsDeterminator;
        this._commandResolver = _commandResolver;
        this._commandExecutor = _commandExecutor;
    }
    Execute(ioState) {
        const ioAddr = ioState.addr;
        const ioEvents = this._iosConfig.IoEvents(ioAddr);
        const eventsToExecute = this._eventsDeterminator.Determine(ioEvents, ioState);
        const ioName = this._iosConfig.IoNameByAddr(ioAddr);
        if (eventsToExecute.length > 0)
            console.log(`${ioName}: ${ioState.previousValue} --> ${ioState.currentValue}`);
        eventsToExecute.forEach(async (eventName) => {
            const rawCommand = ioEvents[eventName];
            const commandToExecute = this._commandResolver.Resolve(eventName, rawCommand, ioState, ioName);
            console.log(`  ${eventName}: ${commandToExecute}`);
            await this._commandExecutor.Execute(commandToExecute);
        });
    }
};
EventsExecutor = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [IoConfig_1.IoConfig,
        EventsDeterminator_1.EventsDeterminator,
        CommandResolver_1.CommandResolver,
        CommandExecutor_1.CommandExecutor])
], EventsExecutor);
exports.EventsExecutor = EventsExecutor;
//# sourceMappingURL=EventsExecutor.js.map