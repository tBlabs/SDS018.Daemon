import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IStorage } from './IStorage';
import { Types } from '../IoC/Types';

interface AppConfigVariables
{
    port: number;
    usb: string;
}

@injectable()
export class AppConfig
{
    private readonly configFileDir = './config/app.config.json';
    private entries: AppConfigVariables;

    public get HostPort(): number
    {
        return this.entries.port;
    }

    public get Usb(): string
    {
        return this.entries.usb;
    }

    constructor(@inject(Types.IStorage) private _storage: IStorage<AppConfigVariables>)
    {
        this._storage.File = this.configFileDir;

        this.entries = this._storage.Read();
    }

    public AddOrUpdate(key: keyof AppConfigVariables, value: string): void
    {
        this.entries[key] = value;

        this._storage.Write(this.entries);
    }

    public Delete(name: keyof AppConfigVariables): void
    {
        delete this.entries[name];

        this._storage.Write(this.entries);
    }

    public ToString(): string
    {
        return JSON.stringify(this.entries);
    }
}
