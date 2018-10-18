import { Config } from "./Config";

describe(Config.name, () =>
{
    let config: Config;

    beforeEach(() =>
    {
        config = new Config();
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