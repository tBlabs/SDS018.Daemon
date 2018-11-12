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
const FluentBuilder_1 = require("../utils/FluentBuilder/FluentBuilder");
const inversify_1 = require("inversify");
const IoCache_1 = require("./IoCache");
const ResponseFrameType_1 = require("./ResponseFrameType");
const RequestFrameType_1 = require("./RequestFrameType");
const Serial_1 = require("./Serial");
const Addr_1 = require("./Addr");
let Driver = class Driver {
    constructor() {
        this.RequestHeader = 0xAABB;
        this.serial = new Serial_1.Serial();
        this.cache = new IoCache_1.IoCache(this.IoCount);
    }
    get State() {
        return this.cache.Entries;
    }
    get Info() {
        return [
            { addr: Addr_1.Addr.Input1, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Input2, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Input3, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Input4, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Input5, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Input6, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Input7, readonly: true, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Adc1, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr_1.Addr.Adc2, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr_1.Addr.Adc3, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr_1.Addr.Adc4, readonly: true, minValue: 0, maxValue: 409 },
            { addr: Addr_1.Addr.RTC, readonly: true, minValue: 0, maxValue: 0xFFFFFFFF },
            { addr: Addr_1.Addr.Output1, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Output2, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Output3, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Output4, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Output5, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Output6, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Output7, readonly: false, minValue: 0, maxValue: 1 },
            { addr: Addr_1.Addr.Pwm1, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr_1.Addr.Pwm2, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr_1.Addr.Pwm3, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr_1.Addr.Pwm4, readonly: false, minValue: 0, maxValue: 1024 },
            { addr: Addr_1.Addr.Display1, readonly: false, minValue: 0, maxValue: 9999 },
            { addr: Addr_1.Addr.Display1Dot, readonly: false, minValue: 0, maxValue: 4 },
        ];
    }
    get IoCount() {
        return this.Info.length;
    }
    async Disconnect() {
        await this.serial.Disconnect();
    }
    Connect(port) {
        this.serial.OnConnection(() => {
            // this.SetPush(true, 20);
        });
        this.serial.OnData((data) => {
            data.forEach(b => parser.Parse(b));
        });
        const parserBuilder = new FluentParserBuilder_1.FluentParserBuilder();
        const parser = parserBuilder
            .Is(0xAB)
            .If(ResponseFrameType_1.ResponseFrameType.Pong, 'type', _ => _)
            .If(ResponseFrameType_1.ResponseFrameType.ConfigUpdate, 'type', _ => _.Get('pushMode').Get('samplingInterval'))
            .If(ResponseFrameType_1.ResponseFrameType.Error, 'type', _ => _.Get('err'))
            .If(ResponseFrameType_1.ResponseFrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
            .If(ResponseFrameType_1.ResponseFrameType.UpdateAllSensors, 'type', _ => _
            .Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4').Get4LE('input5').Get4LE('input6').Get4LE('input7')
            .Get4LE('adc1').Get4LE('adc2').Get4LE('adc3').Get4LE('adc4')
            .Get4LE('rtc'))
            .IsXor()
            .Build();
        parser.OnComplete((out) => {
            this.ExecuteFrame(out);
        });
        let faultsCounter = 0;
        parser.OnFault((reason, frame) => {
            faultsCounter++;
            if ((faultsCounter % 100) === 0)
                console.log('FAULTs', faultsCounter);
        });
        this.serial.Connect(port, 19200);
    }
    ConfigAsString(out) {
        switch (out.pushMode) {
            case 0:
                console.log('PUSH IS OFF');
                break;
            case 1:
                console.log('PUSH ALL IS ON. Interval:', out.samplingInterval);
                break;
            case 2:
                console.log('PUSH SINGLE IS ON. Interval:', out.samplingInterval);
                break;
            default:
                console.log('PUSH IS IN INVALID STATE');
                break;
        }
    }
    ExecuteFrame(out) {
        switch (out.type) {
            case ResponseFrameType_1.ResponseFrameType.ConfigUpdate:
                this.ConfigAsString(out);
                break;
            case ResponseFrameType_1.ResponseFrameType.UpdateAllSensors:
                const sensors = [out.input1, out.input2, out.input3, out.input4, out.input5, out.input6, out.input7, out.adc1, out.adc2, out.adc3, out.adc4, out.rtc];
                sensors.forEach((value, addr) => {
                    this.UpdateCache(addr, value);
                });
                break;
            case ResponseFrameType_1.ResponseFrameType.Error:
                console.log('board error', out.err);
                break;
            case ResponseFrameType_1.ResponseFrameType.Pong:
                console.log('pong from board');
                break;
            case ResponseFrameType_1.ResponseFrameType.Update:
                this.UpdateCache(out.addr, out.value);
                break;
            default:
                throw new Error('Unknown response');
        }
    }
    UpdateCache(addr, value) {
        if (this.cache.HasChanged(addr, value)) {
            this.cache.Update(addr, value);
            if (this.onUpdateCallback) {
                const ioState = this.cache.GetIoState(addr);
                this.onUpdateCallback(ioState);
            }
        }
    }
    Read(addr) {
        return this.cache.Get(addr);
    }
    OnUpdate(callback) {
        this.onUpdateCallback = callback;
    }
    ValidateValue(addr, value) {
        const io = this.Info.find(io => io.addr === addr);
        if (io === undefined) {
            throw new Error(`IO ${addr} not found`);
        }
        if (io.readonly) {
            throw new Error(`Can not write to sensor (addr: ${addr})`);
        }
        if (value > io.maxValue) {
            throw new Error(`Out of range. Max value is ${io.maxValue.toString()} but try to set ${value}`);
        }
        if (value < io.minValue) {
            throw new Error('Out of range. Min value is ' + io.minValue.toString());
        }
    }
    Ping() {
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType_1.RequestFrameType.Ping)
            .Byte(0) // frame size
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
    Set(addr, value) {
        value = Math.round(value);
        this.ValidateValue(addr, value);
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType_1.RequestFrameType.Set)
            .Byte(5) // frame size
            .Byte(addr)
            .Word4LE(value)
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
    Get(addr) {
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType_1.RequestFrameType.Get)
            .Byte(1) // frame size
            .Byte(addr)
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
    GetAll() {
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType_1.RequestFrameType.GetAllSensors)
            .Byte(0) // frame size
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
    SetPush(enable, interval) {
        console.log('TRYING TO SET PUSH');
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Word2LE(this.RequestHeader)
            .Byte(RequestFrameType_1.RequestFrameType.ConfigSet)
            .Byte(2) // frame size
            .Byte(enable ? 1 : 0)
            .Byte(interval)
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
};
Driver = __decorate([
    inversify_1.injectable()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=Driver.js.map