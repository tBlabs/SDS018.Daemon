import { IoEvents } from './../Events/IoEvents';

export class IoConfigStruct
{
    public name: string = '';
    public events?: IoEvents;

    public static get Empty(): IoConfigStruct
    {
        return ({ name: '', events: {} as IoEvents });
    }
}
