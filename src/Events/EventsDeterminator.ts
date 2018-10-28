import { IEventsDeterminator } from './IEventsDeterminator';
import 'reflect-metadata';
import { injectable } from 'inversify';
import { Event } from './Event';
import { IoState } from '../Driver/IoState';
import { IoEvents } from './IoEvents';
import { PressDeterminator } from './EventDeterminators/PressDeterminator';

@injectable()
export class EventsDeterminator implements IEventsDeterminator
{
    constructor(private _pressDeterminator: PressDeterminator)
    { }

    private eventsDefs = {
        [Event.OnChange]: (ioState: IoState) => ioState.currentValue !== ioState.previousValue,
        [Event.OnRising]: (ioState: IoState) => ioState.currentValue > ioState.previousValue,
        [Event.OnFalling]: (ioState: IoState) => ioState.currentValue < ioState.previousValue,
        [Event.OnZero]: (ioState: IoState) => ioState.currentValue === 0,
        [Event.OnNonZero]: (ioState: IoState) => ioState.currentValue !== 0,
        [Event.OnPress]: (ioState: IoState) => this._pressDeterminator.IsPress(ioState, 20, 300),
        [Event.OnLongPress]: (ioState: IoState) => this._pressDeterminator.IsPress(ioState, 300, 2000),
    };

    public Determine(ioEvents: IoEvents, ioState: IoState): Event[]
    {
        const toExecute: Event[] = [];

        if ((ioEvents === undefined) || (ioEvents === {}))
        {
            return toExecute;
        }

        const ioEventsNames: Event[] = Object.keys(ioEvents) as Event[];
        ioEventsNames.forEach((ioEventName: Event) =>
        {
            if (!this.IsCommandDefined(ioEvents, ioEventName)) { return; }

            const eventDef = this.eventsDefs[ioEventName];
            const canExecuteCommand = eventDef(ioState);

            if (canExecuteCommand)
            {
                toExecute.push(ioEventName);
            }
        });

        return toExecute;
    }

    private IsCommandDefined(ioEvents: IoEvents, eventName: string): boolean
    {
        const eventCommand = ioEvents[eventName];

        // TODO: we can do more checks here

        return (eventCommand.trim().length !== 0);
    }
}
