import { IServerResponse } from "./ServerResponse";

export interface IServer
{
    OnIoSet: (addr, val, res: IServerResponse) => void;
    OnIoGet: (addr, res: IServerResponse) => void;
    Start(port?, callback?);
}
