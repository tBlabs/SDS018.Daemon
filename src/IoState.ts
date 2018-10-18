export class IoState
{
    public addr: number = (-1);
    public previousValue: number = (-1);
    public previousValueUpdateTimestamp: number = 0;
    public currentValue: number = (-1);
    public currentValueUpdateTimestamp: number = 0;

    public IsNotInitialValue(): boolean
    {
        return this.previousValue !== (-1);
    }
}