import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IConfig } from './IConfig';
import { IStorage } from './IStorage';
import { StringKeyValuePairs } from './StringKeyValuePairs';
import { Types } from './IoC/Types';

@injectable()
export class Config implements IConfig
{
    private readonly configFileDir = './src/board.config.json';
    private entries: StringKeyValuePairs = {};

    constructor(@inject(Types.IStorage) private _storage: IStorage<StringKeyValuePairs>)
    {
        // if (fs.existsSync(this.configFileDir))
        // {
        //     const configFileContent = fs.readFileSync(this.configFileDir, 'utf8');
        //     this.entries = JSON.parse(configFileContent);
        // }
        this._storage.File = this.configFileDir;
        this.entries = this._storage.Read();
            // console.log('CONFIG', this.entries);
    }

    public AddOrUpdate(name: string, value: string): void
    {
        this.entries[name] = value;

        // fs.writeFileSync(this.configFileDir, JSON.stringify(this.entries));
        this._storage.Write(this.entries);
    }

    public FindPlaceholders(str: string): string[] // public only for test
    {
        const regex = /\{(.+?)\}/gm;

        let matches: string[] = [];
        let m;
        while ((m = regex.exec(str)) !== null)
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex)
            {
                regex.lastIndex++;
            }

            matches.push(m[1]);
        }

        return matches;
    }

    public ApplyOnString(str: string): string
    {
        const placeholders = this.FindPlaceholders(str);

        placeholders.forEach(p =>
        {
            if (this.entries[p] !== undefined)
            {
                str = str.replace('{' + p + '}', this.entries[p]);
            }
        });

        return str;
    }
}