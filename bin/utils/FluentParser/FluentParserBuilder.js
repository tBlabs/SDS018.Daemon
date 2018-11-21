"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Endian_1 = require("./Types/Endian");
const OperationsList_1 = require("./Utils/OperationsList");
const IsOperation_1 = require("./Operations/IsOperation");
const AnyOperation_1 = require("./Operations/AnyOperation");
const GetOperation_1 = require("./Operations/GetOperation");
const IfOperation_1 = require("./Operations/IfOperation");
const StartBufferingOperation_1 = require("./Operations/StartBufferingOperation");
const BufferingOperation_1 = require("./Operations/BufferingOperation");
const IsXorOperation_1 = require("./Operations/IsXorOperation");
const FluentParser_1 = require("./FluentParser");
class FluentParserBuilder {
    constructor() {
        this.operations = new OperationsList_1.OperationsList();
    }
    get List() { return this.operations.List; }
    Build() {
        return new FluentParser_1.FluentParser(this.operations);
    }
    Is(b) {
        this.operations.Add(new IsOperation_1.IsOperation(b));
        return this;
    }
    Any() {
        this.operations.Add(new AnyOperation_1.AnyOperation());
        return this;
    }
    Get(varName) {
        this.operations.Add(new GetOperation_1.GetOperation(varName));
        return this;
    }
    Get2LE(varName) {
        this.operations.Add(new StartBufferingOperation_1.StartBufferingOperation(varName.toString(), 2, Endian_1.Endian.Little));
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        return this;
    }
    Get2BE(varName) {
        this.operations.Add(new StartBufferingOperation_1.StartBufferingOperation(varName.toString(), 2, Endian_1.Endian.Big));
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        return this;
    }
    Get4LE(varName) {
        this.operations.Add(new StartBufferingOperation_1.StartBufferingOperation(varName.toString(), 4, Endian_1.Endian.Little));
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        return this;
    }
    Get4BE(varName) {
        this.operations.Add(new StartBufferingOperation_1.StartBufferingOperation(varName.toString(), 4, Endian_1.Endian.Big));
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        this.operations.Add(new BufferingOperation_1.BufferingOperation());
        return this;
    }
    If(toCompare, varName, builderCallback) {
        const builder = builderCallback(new FluentParserBuilder());
        this.operations.Add(new IfOperation_1.IfOperation(toCompare, varName.toString(), builder.List));
        return this;
    }
    IsXor() {
        this.operations.Add(new IsXorOperation_1.IsXorOperation());
        return this;
    }
}
exports.FluentParserBuilder = FluentParserBuilder;
//# sourceMappingURL=FluentParserBuilder.js.map