import { Event } from './Event';
import { IoState } from '../Driver/IoState';
import { IoEvents } from './IoEvents';
export interface IEventsDeterminator
{
    Determine(ioEvents: IoEvents, ioState: IoState): Event[];
}