import { IoState } from '../../Driver/IoState';
export interface IPressDeterminator
{
    IsPress(ioState: IoState, min: number, max: number): boolean;
}