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
const Types_1 = require("../IoC/Types");
const inversify_1 = require("inversify");
require("reflect-metadata");
const IoConfigStruct_1 = require("./IoConfigStruct");
let IoConfig = class IoConfig {
    constructor(_storage) {
        this._storage = _storage;
        this.configFileDir = './config/io.config.json';
        this.entries = [];
        this._storage.File = this.configFileDir;
        this.entries = this._storage.Read();
    }
    get Entries() {
        return this.entries;
    }
    IoConfigByName(name) {
        const ioConfig = this.entries.find(e => e.name === name);
        if (ioConfig === undefined) {
            throw new Error(`Can not find "${name}" in config`);
        }
        return ioConfig;
    }
    FindByAddr(addr) {
        const ioConfig = this.entries[addr];
        if (ioConfig === undefined) {
            return IoConfigStruct_1.IoConfigStruct.Empty;
        }
        return ioConfig;
    }
    IoEvents(addr) {
        const events = this.FindByAddr(addr).events;
        if (events === undefined)
            return {};
        else
            return events;
    }
    IoNameByAddr(addr) {
        return this.entries[addr].name;
    }
    AddrByName(name) {
        const addr = this.entries.findIndex(e => e.name === name);
        if (addr === (-1)) {
            throw new Error(`"${name}" not found in io.config`);
        }
        return addr;
    }
    NameExists(name) {
        try {
            this.IoConfigByName(name);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    ValidateIoName(name) {
        return /[a-zA-Z0-9\-]{1,100}/.test(name);
    }
    Rename(name, newName) {
        const ioConfig = this.IoConfigByName(name);
        if (this.ValidateIoName(name) === false) {
            throw new Error(`Name "${name}" is invalid`);
        }
        if (this.NameExists(newName)) {
            throw new Error(`Name "${newName}" is already taken`);
        }
        ioConfig.name = newName;
        this._storage.Write(this.entries);
    }
    UpdateEvent(ioName, event, command) {
        const ioConfig = this.IoConfigByName(ioName);
        if (ioConfig.events === undefined)
            ioConfig.events = {};
        ioConfig.events[event.toString()] = command;
        this._storage.Write(this.entries);
    }
    DeleteEvent(ioName, event) {
        const ioConfig = this.IoConfigByName(ioName);
        if (ioConfig.events === undefined)
            ioConfig.events = {};
        delete ioConfig.events[event.toString()];
        this._storage.Write(this.entries);
    }
};
IoConfig = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IStorage)),
    __metadata("design:paramtypes", [Object])
], IoConfig);
exports.IoConfig = IoConfig;
//# sourceMappingURL=IoConfig.js.map