"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoState_1 = require("./IoState");
class IoCache {
    constructor(ioCount) {
        this.cache = [];
        for (let io = 0; io < ioCount; io++) {
            this.cache.push(new IoState_1.IoState(io));
        }
    }
    FindIo(addr) {
        const ioState = this.cache.find(ioState => ioState.addr === addr);
        if (ioState === undefined) {
            throw new Error(`IO with addr ${addr} not found`);
        }
        return ioState;
    }
    HasChanged(addr, value) {
        const io = this.FindIo(addr);
        return io.currentValue !== value;
    }
    Update(addr, value) {
        const io = this.FindIo(addr);
        io.previousValue = io.currentValue;
        io.previousValueUpdateTimestamp = io.currentValueUpdateTimestamp;
        io.currentValue = value;
        io.currentValueUpdateTimestamp = +(new Date());
    }
    Get(addr) {
        const io = this.cache[addr];
        if (io === undefined) {
            throw new Error(`Addr ${addr} not found in IO cache`);
        }
        return io.currentValue;
    }
    toString() {
        return this.cache.map(e => e.currentValue);
    }
    get Entries() {
        return this.cache;
    }
    GetIoState(addr) {
        return this.cache[addr];
    }
}
exports.IoCache = IoCache;
//# sourceMappingURL=IoCache.js.map