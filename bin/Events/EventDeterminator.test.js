"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventsDeterminator_1 = require("./EventsDeterminator");
const Event_1 = require("./Event");
const moq_ts_1 = require("moq.ts");
const IoState_1 = require("../Driver/IoState");
describe(EventsDeterminator_1.EventsDeterminator.name, () => {
    it('should select onChange, onRising and onNonZero events when value is rising', () => {
        // Given
        const ioEvents = {
            [Event_1.Event.OnChange]: 'on-change-action',
            [Event_1.Event.OnRising]: 'on-rising-action',
            [Event_1.Event.OnFalling]: 'on-falling-action',
            [Event_1.Event.OnZero]: 'on-zero-action',
            [Event_1.Event.OnNonZero]: 'on-nonZero-action',
            [Event_1.Event.OnPress]: 'on-press-action',
            [Event_1.Event.OnLongPress]: 'on-longPress-action',
        };
        const ioState = new IoState_1.IoState(0);
        ioState.previousValue = 1;
        ioState.currentValue = 2;
        const pressDeterminatorMock = new moq_ts_1.Mock()
            .setup(i => i.IsPress)
            .returns(() => false);
        const sut = new EventsDeterminator_1.EventsDeterminator(pressDeterminatorMock.object());
        // When
        const eventsToExecute = sut.Determine(ioEvents, ioState);
        // Then
        const expectedEventsToExecute = [
            Event_1.Event.OnChange, Event_1.Event.OnRising, Event_1.Event.OnNonZero
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
//# sourceMappingURL=EventDeterminator.test.js.map