import { IPressDeterminator } from './EventDeterminators/IPressDeterminator';
import { IEventsDeterminator } from './IEventsDeterminator';
import { EventsDeterminator } from './EventsDeterminator';
import { Event } from './Event';
import { Mock } from 'moq.ts';
import { IoState } from '../Driver/IoState';

describe(EventsDeterminator.name, () =>
{
    it('should select onChange, onRising and onNonZero events when value is rising', () =>
    {
        // Given
        const ioEvents = {
            [Event.OnChange]: 'on-change-action',
            [Event.OnRising]: 'on-rising-action',
            [Event.OnFalling]: 'on-falling-action',
            [Event.OnZero]: 'on-zero-action',
            [Event.OnNonZero]: 'on-nonZero-action',
            [Event.OnPress]: 'on-press-action',
            [Event.OnLongPress]: 'on-longPress-action',
        }

        const ioState: IoState = new IoState();
        ioState.previousValue = 1;
        ioState.currentValue = 2;

        const pressDeterminatorMock = new Mock<IPressDeterminator>()
            .setup(i => i.IsPress)
            .returns(() => false);

        const sut = new EventsDeterminator(pressDeterminatorMock.object());

        // When
        const eventsToExecute = sut.Determine(ioEvents, ioState);

        // Then
        const expectedEventsToExecute: Event[] = [
            Event.OnChange, Event.OnRising, Event.OnNonZero
        ];

        expect(eventsToExecute).toEqual(expectedEventsToExecute);
    });

    // it('should not select events with empty or undefined command', () =>
    // {
    //     // Given
    //     const ioEvents = {
    //         // [Event.OnChange]: ..., // onChange is not even defined
    //         [Event.OnRising]: "",
    //         [Event.OnNonZero]: "    ",
    //     }
    //     const ioState: IoState = new IoState();
    //     ioState.previousValue = 1;
    //     ioState.currentValue = 2;

    //     const sut = new EventsDeterminator();

    //     // When
    //     const eventsToExecute = sut.Determine(ioEvents, ioState);

    //     // Then
    //     const expectedEventsToExecute: Event[] = [ ];

    //     expect(eventsToExecute).toEqual(expectedEventsToExecute);
    // });
});
