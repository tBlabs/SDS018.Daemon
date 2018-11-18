"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerialPort = require("serialport");
class Serial {
    constructor() {
        this.isConnected = false;
    }
    async Disconnect() {
        return new Promise((resolve, reject) => {
            if (this.serial) {
                this.serial.close((error) => {
                    resolve();
                });
            }
            else
                reject();
        });
    }
    Connect(port, baudRate) {
        this.serial = new SerialPort(port, { baudRate: baudRate });
        this.serial.on('data', (data) => {
            if (this.onDataCallback) {
                this.onDataCallback(data);
            }
        });
        this.serial.on('open', () => {
            // console.log('SERIAL OPEN @', port);
            this.isConnected = true;
            if (this.onConnectionCallback) {
                this.onConnectionCallback();
            }
        });
        this.serial.on('error', (err) => {
            console.log('SERIAL ERROR', err);
            this.isConnected = false;
        });
        this.serial.on('close', () => {
            // console.log('SERIAL CLOSE');
            this.isConnected = false;
        });
    }
    OnData(onDataCallback) {
        this.onDataCallback = onDataCallback;
    }
    OnConnection(onConnectionCallback) {
        this.onConnectionCallback = onConnectionCallback;
    }
    Send(data) {
        if (this.isConnected) {
            if (this.serial !== undefined) {
                this.serial.write(data);
            }
        }
    }
}
exports.Serial = Serial;
//# sourceMappingURL=Serial.js.map