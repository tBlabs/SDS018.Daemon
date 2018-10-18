import { IoState } from "../IoState";

export interface IPressDeterminator
{
    IsPress(ioState: IoState): boolean;
}