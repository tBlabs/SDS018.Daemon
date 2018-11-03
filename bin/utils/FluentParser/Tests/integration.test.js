"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FluentParserBuilder_1 = require("../FluentParserBuilder");
const FluentBuilder_1 = require("../../FluentBuilder/FluentBuilder");
test('Builder and Parser works together', () => {
    expect.assertions(3);
    // Frame building
    const frameBuilder = new FluentBuilder_1.FluentBuilder();
    const frame = frameBuilder
        .Byte(0xAB).Byte(0xCD).Word2LE(0x1234).Word4LE(0x12345678).Xor()
        .Build();
    // Parser definition
    const parserBuilder = new FluentParserBuilder_1.FluentParserBuilder();
    const parser = parserBuilder
        .Is(0xAB)
        .Get('cmd')
        .Get2LE('value1')
        .Get4LE('value2').IsXor()
        .Build();
    // Hook up on parse complete 
    parser.OnComplete(({ cmd, value1, value2 }) => {
        expect(cmd).toBe(0xCD);
        expect(value1).toBe(0x1234);
        expect(value2).toBe(0x12345678);
    });
    // Pump data into parser
    frame.forEach((b) => {
        parser.Parse(b);
    });
});
//# sourceMappingURL=integration.test.js.map