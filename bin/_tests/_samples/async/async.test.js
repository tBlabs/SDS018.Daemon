"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("./async");
test('async 2+2=4', async () => {
    expect.assertions(1);
    const result = await async_1.SumAsync(2, 2);
    expect(result).toBe(4);
});
//# sourceMappingURL=async.test.js.map