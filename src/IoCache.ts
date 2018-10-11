import { circularDependencyToException } from "inversify/dts/utils/serialization";

export class IoCache
{
    // private cache: { [addr: number]: IoState } = {};
    private cache: IoState[] = [];

    public Update(addr: number, value: number): void
    {
        const io: IoState | undefined = this.cache.find(e => e.addr === addr);

        if (io === undefined)
        {
            this.cache.push(new IoState(addr, value));
        }
        else
        {
            io.oldValue = io.currentValue;
            io.currentValue = value;
        }
    }

    private previousHash = 0;
    public HasChanged(): boolean
    {
        let hash = 0;
        this.cache.forEach(e => hash ^= e.currentValue);

        if (this.previousHash != hash)
        {
            this.previousHash = hash;

            return true;
        }

        return false;
    }
    public Get(addr)
    {
        const io: IoState | undefined = this.cache.find(e => e.addr === addr);

        if (io === undefined)
        {
            throw new Error('addr not found');
        }

        return io.currentValue;
    }

    public toString()
    {
        return this.cache.map(e => e.currentValue);
    }

    public get Entries(): IoState[]
    {
        return this.cache;
    }
}

export class IoState
{
    constructor(
        public addr: number,
        public oldValue: number)
    { }

    public currentValue: number = (-1);
}