"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inversify_1 = require("inversify");
require("reflect-metadata");
let ProcessRunner = class ProcessRunner {
    async Exe(rawCmd) {
        try {
            const output = await this.SpawnProcess(rawCmd);
            console.log(output);
        }
        catch (error) {
            console.log(error.message);
        }
    }
    ;
    async SpawnProcess(rawCmd) {
        return new Promise((resolve, reject) => {
            const process = child_process_1.spawn('sh', ['-c', rawCmd]);
            process.stdout.on('data', (data) => {
                resolve(data.toString());
            });
            process.stderr.on('data', (data) => {
                reject('STDERR: ' + data.toString());
            });
            process.on('error', (error) => {
                reject('ERROR: ' + error.toString());
            });
            process.on('close', (code, signal) => {
                reject('CLOSE: ' + code.toString() + ' ' + signal);
            });
            process.on('disconnect', () => {
                reject('DISCONNECT');
            });
            process.on('exit', (code, signal) => {
                reject('EXIT: ' + code.toString());
            });
            process.on('message', (msg) => {
                reject('MESSAGE: ' + msg);
            });
        });
    }
};
ProcessRunner = __decorate([
    inversify_1.injectable()
], ProcessRunner);
exports.ProcessRunner = ProcessRunner;
//# sourceMappingURL=ProcessRunner.js.map