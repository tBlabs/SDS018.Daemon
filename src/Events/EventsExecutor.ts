import { EventsDeterminator } from "./EventsDeterminator";
import { CommandResolver } from "./CommandResolver";
import { CommandExecutor } from "./CommandExecutor";
import { Event } from './Event';
import { injectable, inject } from 'inversify';
import { IoConfig } from "../Storage/IoConfig";
import { IoState } from "../Driver/IoState";
import { IoEvents } from "./IoEvents";
import { Command } from "./Command";

@injectable()
export class EventsExecutor
{
    constructor(
        private _iosConfig: IoConfig,
        private _eventsDeterminator: EventsDeterminator,
        private _commandResolver: CommandResolver,
        private _commandExecutor: CommandExecutor)
    { }

    public Execute(ioState: IoState): void
    {
        const ioAddr: number = ioState.addr;
        const ioEvents: IoEvents = this._iosConfig.IoEvents(ioAddr);
        const eventsToExecute: Event[] = this._eventsDeterminator.Determine(ioEvents, ioState);
        const ioName: string = this._iosConfig.IoNameByAddr(ioAddr);

        if (eventsToExecute.length > 0)
            console.log(`${ ioName }: ${ ioState.previousValue } --> ${ ioState.currentValue }`);
        
        eventsToExecute.forEach(async (eventName: Event) =>
        {
            const rawCommand: Command = ioEvents[eventName];
            const commandToExecute = this._commandResolver.Resolve(eventName, rawCommand, ioState, ioName);
            console.log(`  ${eventName}: ${commandToExecute}`);
            await this._commandExecutor.Execute(commandToExecute);
        });
    }
}
