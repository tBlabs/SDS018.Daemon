"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OperationsList_1 = require("../Utils/OperationsList");
const IsOperation_1 = require("../Operations/IsOperation");
const IfOperation_1 = require("../Operations/IfOperation");
const AnyOperation_1 = require("../Operations/AnyOperation");
const OperationType_1 = require("../Types/OperationType");
const IsXorOperation_1 = require("../Operations/IsXorOperation");
describe('OperationsList', () => {
    it('should build list', () => {
        const list = new OperationsList_1.OperationsList();
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Add(new IsOperation_1.IsOperation(0x01));
        expect(list.Size).toBe(3);
    });
    it('should detect last', () => {
        const list = new OperationsList_1.OperationsList();
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Next();
        list.Next();
        list.Next();
        expect(list.IsLast).toBeTruthy();
    });
    it('CurrentType should return current item', () => {
        const list = new OperationsList_1.OperationsList();
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Add(new IfOperation_1.IfOperation(0x01, 'if', []));
        list.Add(new AnyOperation_1.AnyOperation());
        expect(list.CurrentType).toBe(OperationType_1.OperationType.Is);
        list.Next();
        expect(list.CurrentType).toBe(OperationType_1.OperationType.If);
        list.Next();
        expect(list.CurrentType).toBe(OperationType_1.OperationType.Any);
        list.Next();
    });
    it('Insert should insert', () => {
        const list = new OperationsList_1.OperationsList();
        list.Add(new IsOperation_1.IsOperation(0x01));
        list.Add(new IfOperation_1.IfOperation(0x01, 'if', []));
        list.Add(new AnyOperation_1.AnyOperation());
        list.Next();
        list.Next();
        list.Next();
        list.InsertAfterCurrent([new IsXorOperation_1.IsXorOperation(), new IsOperation_1.IsOperation(0x05)]);
        expect(list.List.map(i => i.type))
            .toEqual([
            OperationType_1.OperationType.Is,
            OperationType_1.OperationType.If,
            OperationType_1.OperationType.Any,
            OperationType_1.OperationType.IsXor,
            OperationType_1.OperationType.Is,
        ]);
    });
    it('Insert should insert', () => {
        const list = new OperationsList_1.OperationsList();
        list.Add(new IfOperation_1.IfOperation(0x01, 'if', []));
        list.Next();
        list.InsertAfterCurrent([new IsOperation_1.IsOperation(0x02)]);
        expect(list.List.map(i => i.type))
            .toEqual([
            OperationType_1.OperationType.If,
            OperationType_1.OperationType.Is,
        ]);
    });
});
//# sourceMappingURL=OperationsList.test.js.map