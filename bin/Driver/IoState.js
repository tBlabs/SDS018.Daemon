"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IoState {
    constructor(addr) {
        this.addr = addr;
        this.previousValue = 0;
        this.previousValueUpdateTimestamp = 0;
        this.currentValue = 0;
        this.currentValueUpdateTimestamp = 0;
    }
}
exports.IoState = IoState;
//# sourceMappingURL=IoState.js.map