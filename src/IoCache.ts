import { IoState } from "./IoState";

export class IoCache
{
    private cache: IoState[] = [];

    constructor(ioCount: number)
    {
    }

    private FindIo(addr: number): IoState
    {
        const io: IoState | undefined = this.cache.find(ioState => ioState.addr === addr);

        if (io === undefined)
        {
            const ioState = new IoState();
            ioState.addr = addr;
            this.cache.push(ioState);
            // throw new Error("IO not found");
            return ioState;
        }

        return io;
    }

    public HasChanged(addr: number, value: number): boolean
    {
        const io: IoState = this.FindIo(addr);
// console.log('has', io.previousValue, value);
        // if (io.currentValue === (-1)) return false;
        return io.currentValue !== value;
    }

    public Update(addr: number, value: number): void
    {
        const io: IoState = this.FindIo(addr);
// console.log('upd', io.addr);
        io.previousValue = io.currentValue;
        io.previousValueUpdateTimestamp = io.currentValueUpdateTimestamp;
        io.currentValue = value;
        io.currentValueUpdateTimestamp = +(new Date());
    }

    // private previousHash = 0;
    // public HasChanged(): boolean
    // {
    //     let hash = 0;
    //     this.cache.forEach(e => hash ^= e.currentValue);

    //     if (this.previousHash != hash)
    //     {
    //         this.previousHash = hash;

    //         return true;
    //     }

    //     return false;
    // }
    public Get(addr)
    {
        const io: IoState | undefined = this.cache.find(e => e.addr === addr);

        if (io === undefined)
        {
            throw new Error(`Addr ${addr} not found in sensors cache`);
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
