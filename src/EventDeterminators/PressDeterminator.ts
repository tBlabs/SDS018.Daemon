import { IoState } from "../IoState";
import { injectable } from "inversify";

@injectable()
export class PressDeterminator
{
    public IsPress(ioState: IoState, min, max): boolean
    {
        if ((ioState.previousValue === 1) && (ioState.currentValue === 0))
        {
            const timeSpan: number = ioState.currentValueUpdateTimestamp - ioState.previousValueUpdateTimestamp;
// console.log(timeSpan);
            return (timeSpan > min) && (timeSpan <= max);
        }

        return false;
    }
}