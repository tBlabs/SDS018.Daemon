"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Endian_1 = require("../Types/Endian");
class ByteBuffer {
    constructor(size = 0, endian = Endian_1.Endian.Little) {
        this.size = size;
        this.endian = endian;
        this.valueSize = 0;
        this.counter = 0;
        this.buffer = [];
        this.valueSize = size;
        this.counter = size;
    }
    ToValue() {
        switch (this.valueSize) {
            case 2:
                switch (this.endian) {
                    case Endian_1.Endian.Little:
                        return this.buffer[1] << 8 | this.buffer[0];
                    case Endian_1.Endian.Big:
                        return this.buffer[0] << 8 | this.buffer[1];
                }
            case 4:
                switch (this.endian) {
                    case Endian_1.Endian.Little: return this.BufferTo32bitLE(this.buffer);
                    case Endian_1.Endian.Big: return this.BufferTo32bitBE(this.buffer);
                }
            default: throw new Error('Unhandled buffer convert method');
        }
    }
    BufferTo32bitLE(buffer) {
        return (buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0]) >>> 0;
    }
    BufferTo32bitBE(buffer) {
        return ((buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3]) >>> 0;
    }
    Add(b) {
        this.buffer.push(b);
        this.counter--;
    }
    get IsFull() {
        return this.counter === 0;
    }
}
exports.ByteBuffer = ByteBuffer;
//# sourceMappingURL=ByteBuffer.js.map