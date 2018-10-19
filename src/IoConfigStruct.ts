import { IoEvents } from "./IoEvents";

// export interface IoConfigStruct
// {
//     addr: number;
//     name: string;
//     events?: IoEvents;
// }

export class IoConfigStruct
{
    public addr: number = (-1);
    public name: string = "";
    public events?: IoEvents;

    public static get Empty(): IoConfigStruct
    {
        return ({ addr: (-1), name: '', events: <IoEvents>{} });
    }
}
