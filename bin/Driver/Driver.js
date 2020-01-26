"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const FluentParserBuilder_1 = require("../utils/FluentParser/FluentParserBuilder");
const inversify_1 = require("inversify");
const Serial_1 = require("./Serial");
let Driver = class Driver {
    constructor() {
        this.out = {};
        this.serial = new Serial_1.Serial();
    }
    get Pm25() {
        return this.out.pm25;
    }
    get Pm10() {
        return this.out.pm10;
    }
    Connect(port, onConnectionCallback) {
        this.serial.OnConnection(() => {
            if (onConnectionCallback)
                onConnectionCallback();
        });
        this.serial.OnData((data) => {
            data.forEach(b => parser.Parse(b));
        });
        const parserBuilder = new FluentParserBuilder_1.FluentParserBuilder();
        const parser = parserBuilder
            .Is(0xAA).Is(0xC0)
            .Get2LE('pm25').Get2LE('pm10')
            .Any().Any().Any()
            .Is(0xAB)
            .Build();
        parser.OnComplete((out) => {
            this.out = out;
            if (this.onUpdateCallback)
                this.onUpdateCallback(out.pm10, out.pm25);
        });
        let faultsCounter = 0;
        parser.OnFault((reason, frame) => {
            faultsCounter++;
            console.log(`FAULT ${faultsCounter}: ${reason}`);
        });
        this.serial.Connect(port, 9600);
    }
    OnUpdate(callback) {
        this.onUpdateCallback = callback;
    }
    async Disconnect() {
        await this.serial.Disconnect();
    }
};
Driver = __decorate([
    inversify_1.injectable()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=Driver.js.map