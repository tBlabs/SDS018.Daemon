"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IoState {
    constructor(addr) {
        this.addr = addr;
        this.previousValue = (-1);
        this.previousValueUpdateTimestamp = 0;
        this.currentValue = (-1);
        this.currentValueUpdateTimestamp = 0;
    }
    IsNotInitialValue() {
        return this.previousValue !== (-1);
    }
}
exports.IoState = IoState;
//# sourceMappingURL=IoState.js.map