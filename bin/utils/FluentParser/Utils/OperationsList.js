"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OperationType_1 = require("../Types/OperationType");
class OperationsList {
    constructor(operationsList) {
        this.list = [];
        this.currentIndex = 0;
        if (operationsList) {
            this.list = [];
            operationsList.List.forEach(i => this.list.push(i));
        }
        this.currentIndex = 0;
    }
    get List() {
        return this.list;
    }
    toString() {
        return this.currentIndex + '/' + this.Size + ' ' + this.CurrentType + ' '
            + (this.CurrentType === OperationType_1.OperationType.Is ? '0x' + this.Current.toCompare.toString(16) : '')
            + (this.CurrentType === OperationType_1.OperationType.If ? '0x' + this.Current.toCompare.toString(16) : '')
            + (this.CurrentType === OperationType_1.OperationType.Get ? this.Current.varName : '');
    }
    Add(operation) {
        this.list.push(operation);
    }
    Next() {
        this.currentIndex++;
    }
    Reset() {
        this.currentIndex = 0;
    }
    get CurrentIndex() {
        return this.currentIndex;
    }
    get Current() {
        return this.Get(this.currentIndex);
    }
    get CurrentType() {
        return this.Current.type;
    }
    Is(type) {
        return this.CurrentType === type;
    }
    get IsLast() {
        return (this.currentIndex === this.Size);
    }
    Get(index) {
        if (index >= this.list.length) {
            throw new Error('Argument out of range');
        }
        return this.list[index];
    }
    GetType(index) {
        return this.Get(index).type;
    }
    CountType(type) {
        let n = this.currentIndex;
        let count = 0;
        while (this.GetType(n) === type) {
            n++;
            if (n >= this.Size)
                break;
            count++;
        }
        return count;
    }
    InsertAfterCurrent(operations) {
        let i = this.currentIndex;
        operations.forEach(op => {
            this.list.splice(i, 0, op);
            i++;
        });
    }
    Remove(count) {
        this.list.splice(this.currentIndex, count);
    }
    get Size() {
        return this.list.length;
    }
    IsNonZeroIndex() {
        return this.currentIndex > 0;
    }
}
exports.OperationsList = OperationsList;
//# sourceMappingURL=OperationsList.js.map