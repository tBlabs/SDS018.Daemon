import { Types } from './../IoC/Types';
import { Command } from './../Events/Command';
import { IoEvents } from './../Events/IoEvents';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IStorage } from './IStorage';
import { IoConfigStruct } from './IoConfigStruct';

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

    private IoConfigByName(name: string): IoConfigStruct
    {
        const ioConfig: IoConfigStruct | undefined = this.entries.find(e => e.name === name);

        if (ioConfig === undefined)
        {
            throw new Error(`Can not find "${ name }" in config`);
        }

        return ioConfig;
    }

    private FindByAddr(addr: number): IoConfigStruct
    {
        const ioConfig: IoConfigStruct | undefined = this.entries[addr];

        if (ioConfig === undefined)
        {
            return IoConfigStruct.Empty;
        }

        return ioConfig;
    }

    public IoEvents(addr: number): IoEvents
    {
        const events = this.FindByAddr(addr).events;
        if (events === undefined)
            return {};
        else return events;
    }

    public IoNameByAddr(addr: number): string
    {
        return this.entries[addr].name;
    }

    public AddrByName(name: string): number
    {
        const addr = this.entries.findIndex(e => e.name === name);
        if (addr === (-1))
        {
            throw new Error(`"${name}" not found in io.config`);
        }
        return addr;
    }

    private NameExists(name: string): boolean
    {
        try
        {
            this.IoConfigByName(name);
            return true;
        }
        catch (err)
        {
            return false;
        }
    }

    private ValidateIoName(name: string): boolean
    {
        return /[a-zA-Z0-9\-]{1,100}/.test(name);
    }

    public Rename(name: string, newName: string): void
    {
        const ioConfig: IoConfigStruct = this.IoConfigByName(name);

        if (this.ValidateIoName(name) === false)
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
        const ioConfig: IoConfigStruct = this.IoConfigByName(ioName);

        if (ioConfig.events === undefined)
            ioConfig.events = {};

        ioConfig.events[event.toString()] = command;

        this._storage.Write(this.entries);
    }

    public DeleteEvent(ioName: string, event: Event): void
    {
        const ioConfig: IoConfigStruct = this.IoConfigByName(ioName);

        if (ioConfig.events === undefined)
            ioConfig.events = {};

        delete ioConfig.events[event.toString()];

        this._storage.Write(this.entries);
    }
}
