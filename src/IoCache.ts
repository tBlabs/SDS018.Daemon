import { circularDependencyToException } from "inversify/dts/utils/serialization";
import { IoState } from "./IoState";

export class IoCache
{
    // private cache: { [addr: number]: IoState } = {};
    private cache: IoState[] = [];

    constructor(ioCount: number)
    {
        this.cache = new Array(ioCount);
    }

    private FindIo(addr: number): IoState
    {
        const io: IoState | undefined = this.cache.find(e => e.addr === addr);

        if (io === undefined)
        {
            throw new Error("IO not found");
        }

        return io;
    }

    public Update(addr: number, value: number): void
    {
        const io: IoState = this.FindIo(addr);

        io.addr = addr;
        io.previousValue = io.currentValue;
        io.previousValueUpdateTimestamp = io.currentValueUpdateTimestamp;
        io.currentValue = value;
        io.currentValueUpdateTimestamp = +(new Date());
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
