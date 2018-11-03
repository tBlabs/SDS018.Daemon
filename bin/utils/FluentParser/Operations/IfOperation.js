"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OperationType_1 = require("../Types/OperationType");
class IfOperation {
    constructor(toCompare, varName, list) {
        this.toCompare = toCompare;
        this.varName = varName;
        this.list = list;
        this.type = OperationType_1.OperationType.If;
    }
}
exports.IfOperation = IfOperation;
//# sourceMappingURL=IfOperation.js.map