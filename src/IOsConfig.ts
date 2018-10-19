import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IConfig } from './IConfig';
import { IStorage } from './IStorage';
import { StringKeyValuePairs } from './StringKeyValuePairs';
import { Types } from './IoC/Types';
import { IoConfigStruct } from './IoConfigStruct';
import { Command } from './Command';

export type IoConfigEntries = { [ioAddr: string]: IoConfigStruct };

@injectable()
export class IOsConfig
{
    private readonly configFileDir = './src/io.config.json';
    private entries: IoConfigEntries = {};

    public get Entries(): IoConfigEntries
    {
        return this.entries;
    }

    constructor(@inject(Types.IStorage) private _storage: IStorage<IoConfigEntries>)
    {
        this._storage.File = this.configFileDir;
        this.entries = this._storage.Read();
    }

    public AddrByName(name: string): number
    {
        const addr: string | undefined = Object.keys(this.entries).find(addr => this.entries[addr].name === name);

        if (addr === undefined)
        {
            throw new Error('Not found');
        }

        return parseInt(addr);
    }

    public Rename(name: string, newName: string): void
    {
        const addr = this.AddrByName(name);
        // TODO: validate new name
        // TODO: chceck new name uniqueness
        this.entries[addr.toString()].name = newName;

        this._storage.Write(this.entries);
    }

    public UpdateEvent(event: Event, command: Command): void
    {
        
    }
}
