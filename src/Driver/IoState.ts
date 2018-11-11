export class IoState
{
    constructor(public addr: number)
    { }

    public previousValue: number = 0;
    public previousValueUpdateTimestamp: number = 0;
    public currentValue: number = 0;
    public currentValueUpdateTimestamp: number = 0;
}
