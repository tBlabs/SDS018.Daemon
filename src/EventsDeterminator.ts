import { IoState } from "./IoState";
import { Event } from './Event';
import { IoEvents } from './Main';
import { PressDeterminator } from './EventDeterminators/PressDeterminator';

export class EventsDeterminator
{
    constructor(private _pressDeterminator: PressDeterminator)
    { }

    private eventsDefs = {
        [Event.OnChange]: (ioState: IoState) => ioState.currentValue !== ioState.previousValue,
        [Event.OnRising]: (ioState: IoState) => ioState.currentValue > ioState.previousValue,
        [Event.OnFalling]: (ioState: IoState) => ioState.currentValue < ioState.previousValue,
        [Event.OnZero]: (ioState: IoState) => ioState.currentValue === 0,
        [Event.OnNonZero]: (ioState: IoState) => ioState.currentValue !== 0,
        [Event.OnPress]: (ioState: IoState) => this._pressDeterminator.IsPress(ioState),
    };


    public Determine(ioEvents: IoEvents, ioState: IoState): Event[]
    {
        const toExecute: Event[] = [];
        // const ioConfig = config[ioState.addr];
        if (ioEvents === undefined)
            return toExecute;
        // const ioEvents: IoEvents[] = ioEvents.events;
        const ioEventsNames: Event[] = Object.keys(ioEvents) as Event[];
        ioEventsNames.forEach((ioEventName: Event) =>
        {
            // encapsulate in IsCommandDefined
            const eventCommand = ioEvents[ioEventName];
            if (eventCommand.trim().length === 0)
                return; // IsDefined
            const eventDef = this.eventsDefs[ioEventName];
            const canExecuteCommand = eventDef(ioState);
            // console.log(ioEventName, eventCommand, canExecuteCommand);
            if (canExecuteCommand)
            {
                toExecute.push(ioEventName);
            }
        });
        return toExecute;
    }
}