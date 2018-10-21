import { injectable } from 'inversify';
import 'reflect-metadata';
import { IStorage } from './IStorage';
import * as fs from 'fs';

@injectable()
export class Storage<T> implements IStorage<T> 
{
    public File: string = "";

    public Read(): T
    {
        if (fs.existsSync(this.File))
        {
            const configFileContent = fs.readFileSync(this.File, 'utf8');
            return JSON.parse(configFileContent);
        }
        
        return {} as T;
    }

    public Write(obj: T): void
    {
        fs.writeFileSync(this.File, JSON.stringify(obj));
    }
}