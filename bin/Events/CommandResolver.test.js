"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moq_ts_1 = require("moq.ts");
const UserConfig_1 = require("../Storage/UserConfig");
const CommandResolver_1 = require("./CommandResolver");
const IoState_1 = require("../Driver/IoState");
describe(CommandResolver_1.CommandResolver.name, () => {
    it(CommandResolver_1.CommandResolver.prototype.Resolve.name, () => {
        // Given
        const _storageMock = new moq_ts_1.Mock()
            .setup(i => i.Read).returns(() => ({ host: "localhost:1234" }))
            .setup(i => i.Write(moq_ts_1.It.IsAny())).callback(() => { });
        const _config = new UserConfig_1.UserConfig(_storageMock.object());
        const sut = new CommandResolver_1.CommandResolver(_config);
        const ioState = new IoState_1.IoState(1);
        ioState.currentValue = 123;
        // When
        const ret = sut.Resolve("onChange", "http://{host}/{this.event}/{this.addr}/{this.value}", ioState, 'ioName');
        // Then
        expect(ret).toBe('http://localhost:1234/onChange/1/123');
    });
});
//# sourceMappingURL=CommandResolver.test.js.map