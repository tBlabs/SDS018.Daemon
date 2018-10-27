import { UserConfig } from './UserConfig';
import { Mock, It } from 'moq.ts';
import { IStorage } from './IStorage';
import { StringKeyValuePairs } from './StringKeyValuePairs';

describe(UserConfig.name, () =>
{
    let config: UserConfig;

    beforeEach(() =>
    {
        const _storageMock = new Mock<IStorage<StringKeyValuePairs>>()
            .setup(i => i.Read).returns(() => ({}))
            .setup(i => i.Write(It.IsAny<string>())).callback(() => {});

        config = new UserConfig(_storageMock.object());
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
