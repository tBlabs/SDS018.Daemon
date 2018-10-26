import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IUserConfig } from './IConfig';
import { IStorage } from './IStorage';
import { StringKeyValuePairs } from './StringKeyValuePairs';
import { Types } from './IoC/Types';

@injectable()
export class UserConfig implements IUserConfig
{
    private readonly configFileDir = './src/Config/user.config.json';
    private entries: StringKeyValuePairs = {};

    public ToString(): string
    {
        return JSON.stringify(this.entries);
    }

    constructor(@inject(Types.IStorage) private _storage: IStorage<StringKeyValuePairs>)
    {
        this._storage.File = this.configFileDir;

        this.entries = this._storage.Read();
    }

    public AddOrUpdate(name: string, value: string): void
    {
        this.entries[name] = value;

        this._storage.Write(this.entries);
    }

    public Delete(name: string): void
    {
        if (!Object.keys(this.entries).includes(name))
        {
            throw new Error(`Entry "${name}" not exists`);
        }

        delete this.entries[name];

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