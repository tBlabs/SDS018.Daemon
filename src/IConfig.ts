export interface IConfig
{
    AddOrUpdate(name: string, value: string): void;
    ApplyOnString(str: string): string;
}