"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OperationType_1 = require("../Types/OperationType");
class StartBufferingOperation {
    constructor(varName, varSize, endian) {
        this.varName = varName;
        this.varSize = varSize;
        this.endian = endian;
        this.type = OperationType_1.OperationType.StartBuffering;
    }
}
exports.StartBufferingOperation = StartBufferingOperation;
//# sourceMappingURL=StartBufferingOperation.js.map