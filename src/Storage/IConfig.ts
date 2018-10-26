export interface IUserConfig
{
    AddOrUpdate(name: string, value: string): void;
    ApplyOnString(str: string): string;
}