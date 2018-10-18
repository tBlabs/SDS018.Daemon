export interface IStorage<T>
{
    File?: string;
    Read(): T;
    Write(obj: T): void;
}