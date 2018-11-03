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
require("reflect-metadata");
const Types_1 = require("../IoC/Types");
let AppConfig = class AppConfig {
    constructor(_storage) {
        this._storage = _storage;
        this.configFileDir = './config/app.config.json';
        this._storage.File = this.configFileDir;
        this.entries = this._storage.Read();
    }
    get HostPort() {
        return this.entries.port;
    }
    get Usb() {
        return this.entries.usb;
    }
    AddOrUpdate(key, value) {
        this.entries[key] = value;
        this._storage.Write(this.entries);
    }
    Delete(name) {
        delete this.entries[name];
        this._storage.Write(this.entries);
    }
    ToString() {
        return JSON.stringify(this.entries);
    }
};
AppConfig = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IStorage)),
    __metadata("design:paramtypes", [Object])
], AppConfig);
exports.AppConfig = AppConfig;
//# sourceMappingURL=AppConfig.js.map