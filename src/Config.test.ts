import { Config } from "./Config";
import { StringKeyValuePairs } from "./StringKeyValuePairs";
import { IStorage } from "./IStorage";
import { Mock, It } from "moq.ts";
import { IEnvironment } from "./services/environment/IEnvironment";
interface ITestObject
{
    property1: number;
    property2: number;
    property3: number;
    property4: number;
    method(): void;
}

describe(Config.name, () =>
{
    let config: Config;

        beforeEach(() =>
        {
            const _storageMock = new Mock<IStorage<StringKeyValuePairs>>()
                .setup(i=>i.Read).returns(()=>({}))
                .setup(i=>i.Write(It.IsAny<string>())).callback(()=>{});

            config = new Config(_storageMock.object());
        });

    it('FindPlaceholders should return placeholders', () =>
    {
        const placeholders: string[] = config.FindPlaceholders('{a}{b}');

        expect(placeholders).toEqual(['a', 'b']);
    });

    it('should apply variables on string', () =>
    {
        config.AddOrUpdate('http', 'http://');
        config.AddOrUpdate('ip', '1.1.1.1');
        config.AddOrUpdate('port', '3000');

        const output = config.ApplyOnString('{http}{ip}:{port}/foo/bar');

        expect(output).toBe('http://1.1.1.1:3000/foo/bar');
    });
});