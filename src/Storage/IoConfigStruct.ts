import { IoEvents } from './../Events/IoEvents';

export class IoConfigStruct
{
    public addr: number = (-1);
    public name: string = '';
    public events?: IoEvents;

    public static get Empty(): IoConfigStruct
    {
        return ({ addr: (-1), name: '', events: {} as IoEvents });
    }
}
