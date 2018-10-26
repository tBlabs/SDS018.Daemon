import { IoState } from "./IoState";
import { IoEvents } from "./IoEvents";
import { Command } from "./Command";
import { IOsConfig } from "./IOsConfig";
import { EventsDeterminator } from "./EventsDeterminator";
import { CommandResolver } from "./CommandResolver";
import { CommandExecutor } from "./Executor";
import { Event } from './Event';
import { injectable, inject } from 'inversify';

@injectable()
export class EventsExecutor
{
    constructor(
        private _iosConfig: IOsConfig,
        private _eventsDeterminator: EventsDeterminator,
        private _commandResolver: CommandResolver,
        private _commandExecutor: CommandExecutor)
    { }

    public Execute(ioState: IoState): void
    {
        const ioAddr: number = ioState.addr;
        const ioEvents: IoEvents = this._iosConfig.IoEvents(ioAddr);
        const eventsToExecute: Event[] = this._eventsDeterminator.Determine(ioEvents, ioState);
        
        if (eventsToExecute.length > 0)
        console.log(`${ ioState.addr }: ${ ioState.previousValue } --> ${ ioState.currentValue }`);
        
        eventsToExecute.forEach(async (eventName: Event) =>
        {
            const ioName: string = this._iosConfig.IoName(ioAddr);
            const rawCommand: Command = ioEvents[eventName];
            const commandToExecute = this._commandResolver.Resolve(eventName, rawCommand, ioState, ioName);
            console.log('  ', eventName, commandToExecute);
            await this._commandExecutor.Execute(commandToExecute);
        });
    }
}
