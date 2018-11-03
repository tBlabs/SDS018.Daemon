"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = require("./sync");
test('1+2 as string = "3"', () => {
    const output = sync_1.SumAndStringify(1, 2);
    expect(output).toBe('3');
});
//# sourceMappingURL=sync.test.js.map