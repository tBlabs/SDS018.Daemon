"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteBuffer_1 = require("./Utils/ByteBuffer");
const OperationsList_1 = require("./Utils/OperationsList");
const OperationType_1 = require("./Types/OperationType");
class FluentParser {
    constructor(_operations) {
        this._operations = _operations;
        this.onFaultCallback = (reason, frame) => console.log('FRAME PARSE FAULT', reason);
        this.out = {};
        this.bufferVarName = '';
        this.buffer = new ByteBuffer_1.ByteBuffer();
        this.frame = [];
        this.operationsCopy = new OperationsList_1.OperationsList(this._operations);
    }
    Xor(frame) {
        return frame.reduce((xor, next) => {
            return xor ^ next;
        });
    }
    Parse(b) {
        this.frame.push(b);
        const op = this._operations.Current;
        switch (op.type) // if switch by object type is possible then .type could be removed
         {
            case OperationType_1.OperationType.IsXor:
                const dataForXor = this.frame.slice(0, this.frame.length - 1);
                const xor = this.Xor(dataForXor);
                if (b === xor) {
                    this.Next();
                }
                else {
                    this.Reset('checksum');
                }
                break;
            case OperationType_1.OperationType.Is:
                const toCompare = op.toCompare;
                if (b === toCompare) {
                    this.Next();
                }
                else
                    this.Reset(b.toString() + ' is not ' + toCompare);
                break;
            case OperationType_1.OperationType.Get:
                const varName = op.varName;
                this.out[varName.toString()] = b;
                this.Next();
                break;
            case OperationType_1.OperationType.Any:
                this.Next();
                break;
            case OperationType_1.OperationType.StartBuffering:
                this.bufferVarName = op.varName;
                const varSize = op.varSize;
                const endian = op.endian;
                this.buffer = new ByteBuffer_1.ByteBuffer(varSize, endian);
                this.buffer.Add(b);
                this.Next();
                break;
            case OperationType_1.OperationType.Buffering:
                this.buffer.Add(b);
                if (this.buffer.IsFull) {
                    this.out[this.bufferVarName] = this.buffer.ToValue();
                }
                this.Next();
                break;
            case OperationType_1.OperationType.If:
                let anyIfFulfilled = false;
                while (this._operations.Is(OperationType_1.OperationType.If)) {
                    const toCompare = this._operations.Current.toCompare;
                    if (b === toCompare) {
                        anyIfFulfilled = true;
                        const list = this._operations.Current.list;
                        const varName = this._operations.Current.varName;
                        this.out[varName] = b;
                        let toRemove = this._operations.CountType(OperationType_1.OperationType.If);
                        if (toRemove === 0)
                            toRemove = 1;
                        this._operations.Remove(toRemove);
                        this._operations.InsertAfterCurrent(list);
                        break;
                    }
                    this.Next();
                    if (this._operations.IsLast) {
                        if (anyIfFulfilled === false) {
                            this.Reset('any if is fulfilled (at the end)');
                        }
                        else
                            this.EndingReset();
                        break;
                    }
                }
                if (anyIfFulfilled === false) {
                    this.Reset('any if is fulfilled');
                }
                break;
        }
        if (this._operations.IsLast) {
            if (this.onCompleteCallback)
                this.onCompleteCallback(this.out, this.frame);
            this.EndingReset();
        }
        return this;
    }
    Next() {
        this._operations.Next();
    }
    CleanUp() {
        this._operations.Reset();
        this._operations = new OperationsList_1.OperationsList(this.operationsCopy);
        this.out = {};
        this.frame = [];
    }
    EndingReset() {
        this.CleanUp();
    }
    Reset(reason) {
        if (this._operations.IsNonZeroIndex()) {
            this.onFaultCallback(reason, this.frame);
        }
        this.CleanUp();
    }
    OnComplete(callback) {
        this.onCompleteCallback = callback;
    }
    OnFault(callback) {
        this.onFaultCallback = callback;
    }
}
exports.FluentParser = FluentParser;
//# sourceMappingURL=FluentParser.js.map