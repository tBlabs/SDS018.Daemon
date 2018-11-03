"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FluentParserBuilder_1 = require("../utils/FluentParser/FluentParserBuilder");
const FluentBuilder_1 = require("../utils/FluentBuilder/FluentBuilder");
const inversify_1 = require("inversify");
require("reflect-metadata");
const IoCache_1 = require("./IoCache");
const ResponseFrameType_1 = require("./ResponseFrameType");
const RequestFrameType_1 = require("./RequestFrameType");
const Serial_1 = require("./Serial");
let Driver = class Driver {
    constructor() {
        this.RequestHeader = 0xAABB;
        this.serial = new Serial_1.Serial();
        this.cache = new IoCache_1.IoCache(this.IoCount);
    }
    get Info() {
        let addr = 0;
        return [
            { addr: addr++, name: "Input1", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input2", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input3", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input4", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input5", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input6", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Input7", type: "INPUT", readonly: true, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Adc1", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "Adc2", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "Adc3", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "Adc4", type: "ADC", readonly: true, minValue: 0, maxValue: 409 },
            { addr: addr++, name: "RTC", type: "RTC", readonly: true, minValue: 0, maxValue: 0xFFFFFFFF },
            { addr: addr++, name: "Output1", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output2", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output3", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output4", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output5", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output6", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Output7", type: "OUTPUT", readonly: false, minValue: 0, maxValue: 1 },
            { addr: addr++, name: "Pwm1", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Pwm2", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Pwm3", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Pwm4", type: "PWM", readonly: false, minValue: 0, maxValue: 1024 },
            { addr: addr++, name: "Display1", type: "DISPLAY", readonly: false, minValue: 0, maxValue: 9999 },
            { addr: addr++, name: "Display1Dot", type: "DISPLAY_DOT", readonly: false, minValue: 0, maxValue: 4 },
        ];
    }
    get IoCount() {
        return this.Info.length;
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
            .If(ResponseFrameType_1.ResponseFrameType.ConfigUpdate, 'type', _ => _.Get('push'))
            .If(ResponseFrameType_1.ResponseFrameType.Error, 'type', _ => _.Get('err'))
            .If(ResponseFrameType_1.ResponseFrameType.Update, 'type', _ => _.Get('addr').Get4LE('value'))
            .If(ResponseFrameType_1.ResponseFrameType.UpdateAllSensors, 'type', _ => _
            .Get4LE('input1').Get4LE('input2').Get4LE('input3').Get4LE('input4').Get4LE('input5').Get4LE('input6').Get4LE('input7')
            .Get4LE('adc1').Get4LE('adc2').Get4LE('adc3').Get4LE('adc4')
            .Get4LE('rtc'))
            .IsXor()
            .Build();
        parser.OnComplete((out) => {
            switch (out.type) {
                case ResponseFrameType_1.ResponseFrameType.ConfigUpdate:
                    switch (out.push) {
                        case 0:
                            console.log('PUSH IS OFF');
                            break;
                        case 1:
                            console.log('PUSH ALL IS ON');
                            break;
                        case 2:
                            console.log('PUSH SINGLE IS ON');
                            break;
                        default:
                            console.log('PUSH IS IN INVALID STATE');
                            break;
                    }
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
        });
        parser.OnFault((reason, frame) => {
            console.log('FAULT', reason);
        });
        this.serial.Connect(port, 19200);
    }
    UpdateCache(addr, value) {
        if (this.cache.HasChanged(addr, value)) {
            this.cache.Update(addr, value);
            if (this.onUpdateCallback) {
                const ioState = this.cache.GetIoState(addr);
                if (ioState.IsNotInitialValue()) {
                    this.onUpdateCallback(ioState);
                }
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
            throw new Error('Can not write to sensor');
        }
        if (value > io.maxValue) {
            throw new Error('Out of range. Max value is ' + io.maxValue.toString());
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