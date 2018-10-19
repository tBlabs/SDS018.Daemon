import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IUserConfig } from './IConfig';
import { IStorage } from './IStorage';
import { StringKeyValuePairs } from './StringKeyValuePairs';
import { Types } from './IoC/Types';
import { IoConfigStruct } from './IoConfigStruct';
import { Command } from './Command';
import { IoEvents } from './IoEvents';

export type IoConfigEntries = { [ioAddr: string]: IoConfigStruct };

@injectable()
export class IOsConfig
{
    private readonly configFileDir = './src/Config/io.config.json';
    private entries: IoConfigStruct[] = [];

    public get Entries(): IoConfigStruct[]
    {
        return this.entries;
    }

    constructor(@inject(Types.IStorage) private _storage: IStorage<IoConfigStruct[]>)
    {
        this._storage.File = this.configFileDir;
        this.entries = this._storage.Read();
    }

    // public AddrByName(name: string): number
    // {
    //     const addr: number | undefined = this.entries.find(io => io.name === name);

    //     if (addr === undefined)
    //     {
    //         throw new Error('Not found');
    //     }

    //     return parseInt(addr);
    // }
    private FindByName(name: string): IoConfigStruct
    {
        const ioConfig: IoConfigStruct | undefined = this.entries.find(io => io.name === name);

        if (ioConfig === undefined)
        {
            throw new Error(`Can not find "${ name }" in config`);
        }

        return ioConfig;
    }
    
    private FindByAddr(addr: number): IoConfigStruct
    {
        const ioConfig: IoConfigStruct | undefined = this.entries.find(io => io.addr === addr);

        if (ioConfig === undefined)
        {
            // throw new Error(`Can not find IO config with addr ${ addr }`);
            // return ({ addr: (-1), name: '', events: {}});
            return IoConfigStruct.Empty;
        }

        return ioConfig;
    }

    public IoEvents(addr: number): IoEvents
    {
        const events = this.FindByAddr(addr).events;
        if (events === undefined) return {};
        else return events;
        // return this.FindByAddr(addr).events;
    }

    public AddrByName(name: string): number
    {
        return this.FindByName(name).addr;
    }

    private NameExists(name: string): boolean
    {
        try
        {
            this.FindByName(name);
            return true;
        } 
        catch (err)
        {
            return false;
        }
    }

    private ValidateName(name: string): boolean
    {
        return /[a-zA-Z0-9\-]{1,100}/.test(name);
    }

    public Rename(name: string, newName: string): void
    {
        const ioConfig: IoConfigStruct = this.FindByName(name);
        
        if (this.ValidateName(name) === false)
        {
            throw new Error(`Name "${ name }" is invalid`);
        }
        
        if (this.NameExists(newName))
        {
            throw new Error(`Name "${ newName }" is already taken`);
        }
        
        ioConfig.name = newName;
        
        this._storage.Write(this.entries);
    }
    
    public UpdateEvent(ioName: string, event: Event, command: Command): void
    {
        const ioConfig: IoConfigStruct = this.FindByName(ioName);

        if (ioConfig.events === undefined)
            ioConfig.events = {};

        ioConfig.events[event.toString()] = command;
        
        this._storage.Write(this.entries);
    }
}
