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
const Event_1 = require("./Event");
const PressDeterminator_1 = require("./EventDeterminators/PressDeterminator");
let EventsDeterminator = class EventsDeterminator {
    constructor(_pressDeterminator) {
        this._pressDeterminator = _pressDeterminator;
        this.eventsDefs = {
            [Event_1.Event.OnChange]: (ioState) => ioState.currentValue !== ioState.previousValue,
            [Event_1.Event.OnRising]: (ioState) => ioState.currentValue > ioState.previousValue,
            [Event_1.Event.OnFalling]: (ioState) => ioState.currentValue < ioState.previousValue,
            [Event_1.Event.OnZero]: (ioState) => ioState.currentValue === 0,
            [Event_1.Event.OnNonZero]: (ioState) => ioState.currentValue !== 0,
            [Event_1.Event.OnPress]: (ioState) => this._pressDeterminator.IsPress(ioState, 20, 300),
            [Event_1.Event.OnLongPress]: (ioState) => this._pressDeterminator.IsPress(ioState, 300, 2000),
            [Event_1.Event.OnDiff2]: (ioState) => Math.abs(ioState.currentValue - ioState.previousValue) >= 2,
            [Event_1.Event.OnDiff3]: (ioState) => Math.abs(ioState.currentValue - ioState.previousValue) >= 3,
            [Event_1.Event.OnDiff5]: (ioState) => Math.abs(ioState.currentValue - ioState.previousValue) >= 5,
        };
    }
    Determine(ioEvents, ioState) {
        const toExecute = [];
        if ((ioEvents === undefined) || (ioEvents === {})) {
            return toExecute;
        }
        const ioEventsNames = Object.keys(ioEvents);
        ioEventsNames.forEach((ioEventName) => {
            if (!this.IsCommandDefined(ioEvents, ioEventName)) {
                return;
            }
            const eventDef = this.eventsDefs[ioEventName];
            const canExecuteCommand = eventDef(ioState);
            if (canExecuteCommand) {
                toExecute.push(ioEventName);
            }
        });
        return toExecute;
    }
    IsCommandDefined(ioEvents, eventName) {
        const eventCommand = ioEvents[eventName];
        // TODO: we can do more checks here
        return (eventCommand.trim().length !== 0);
    }
};
EventsDeterminator = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [PressDeterminator_1.PressDeterminator])
], EventsDeterminator);
exports.EventsDeterminator = EventsDeterminator;
//# sourceMappingURL=EventsDeterminator.js.map