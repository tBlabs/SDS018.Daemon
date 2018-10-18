import { IoState } from "../IoState";

export class PressDeterminator
{
    public IsPress(ioState: IoState): boolean
    {
        if ((ioState.previousValue === 1) && (ioState.currentValue === 0))
        {
            const timeSpan: number = ioState.currentValueUpdateTimestamp - ioState.previousValueUpdateTimestamp;

            return (timeSpan <= 200);
        }

        return false;
    }
}