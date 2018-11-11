export interface IServerResponse
{
    Text(value: any): void;
    Accepted(): void;
}

export class ServerResponse
{
    constructor(private expressResponse)
    {

    }

    public Text(value: any): void
    {
        this.expressResponse.send(value.toString);
    }

    public Accepted(): void
    {
        this.expressResponse.sendStatus(202);
    }
}
