"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OperationType_1 = require("../Types/OperationType");
class GetOperation {
    constructor(varName) {
        this.varName = varName;
        this.type = OperationType_1.OperationType.Get;
    }
}
exports.GetOperation = GetOperation;
//# sourceMappingURL=GetOperation.js.map