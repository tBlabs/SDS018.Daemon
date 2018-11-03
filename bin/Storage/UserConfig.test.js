"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserConfig_1 = require("./UserConfig");
const moq_ts_1 = require("moq.ts");
describe(UserConfig_1.UserConfig.name, () => {
    let config;
    beforeEach(() => {
        const _storageMock = new moq_ts_1.Mock()
            .setup(i => i.Read).returns(() => ({}))
            .setup(i => i.Write(moq_ts_1.It.IsAny())).callback(() => { });
        config = new UserConfig_1.UserConfig(_storageMock.object());
    });
    it('FindPlaceholders should return placeholders', () => {
        const placeholders = config.FindPlaceholders('{a}{b}');
        expect(placeholders).toEqual(['a', 'b']);
    });
    it('should apply variables on string', () => {
        config.AddOrUpdate('http', 'http://');
        config.AddOrUpdate('ip', '1.1.1.1');
        config.AddOrUpdate('port', '3000');
        const output = config.ApplyOnString('{http}{ip}:{port}/foo/bar');
        expect(output).toBe('http://1.1.1.1:3000/foo/bar');
    });
});
//# sourceMappingURL=UserConfig.test.js.map