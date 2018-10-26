import { IoState } from "./IoState";

export class IoCache
{
    private cache: IoState[] = [];

    private FindIo(addr: number): IoState
    {
        const io: IoState | undefined = this.cache.find(ioState => ioState.addr === addr);

        if (io === undefined)
        {
            const ioState = new IoState();
            ioState.addr = addr;
            this.cache.push(ioState);

            return ioState;
        }

        return io;
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
