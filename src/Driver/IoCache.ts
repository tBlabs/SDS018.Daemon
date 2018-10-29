import { IoState } from "./IoState";

export class IoCache
{
    private cache: IoState[] = [];

    constructor(ioCount: number)
    {
        for (let io = 0; io < ioCount; io++)
        {
            this.cache.push(new IoState(io));
        }
        // console.log(this.cache );
    }

    private FindIo(addr: number): IoState
    {
        const ioState: IoState | undefined = this.cache.find(ioState => ioState.addr === addr);

        if (ioState === undefined)
        {
            throw new Error(`IO with addr ${addr} not found`);
        }

        return ioState;
    }

    public HasChanged(addr: number, value: number): boolean
    {
        const io: IoState = this.FindIo(addr);

        return io.currentValue !== value;
    }

    public Update(addr: number, value: number): void
    {
        const io: IoState = this.FindIo(addr);

        io.previousValue = io.currentValue;
        io.previousValueUpdateTimestamp = io.currentValueUpdateTimestamp;
        io.currentValue = value;
        io.currentValueUpdateTimestamp = +(new Date());
    }

    public Get(addr: number): number
    {
        const io: IoState | undefined = this.cache[addr];

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

    public GetIoState(addr: number): IoState
    {
        return this.cache[addr];
    }
}
