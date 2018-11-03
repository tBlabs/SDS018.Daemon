"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
let Environment = class Environment {
    Exists(key) {
        return (process.env[key] !== undefined);
    }
    IsSet(key) {
        if (!this.Exists(key)) {
            return false;
        }
        if (process.env[key] !== '') {
            return true;
        }
        return false;
    }
    ValueOf(key) {
        if (!this.Exists(key)) {
            throw new Error('Environment variable "' + key + '" not exists');
        }
        return process.env[key] || '';
    }
    ValueOrDefault(key, defaultValue) {
        try {
            return this.ValueOf(key);
        }
        catch (ex) {
            return defaultValue;
        }
    }
};
Environment = __decorate([
    inversify_1.injectable()
], Environment);
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map