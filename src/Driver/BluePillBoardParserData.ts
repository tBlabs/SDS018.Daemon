import { ResponseFrameType } from "./ResponseFrameType";

export interface BluePillBoardParserData
{
    type: ResponseFrameType;
    pushMode: number;
    samplingInterval: number;
    err: number;
    addr: number;
    value: number;
    input1: number;
    input2: number;
    input3: number;
    input4: number;
    input5: number;
    input6: number;
    input7: number;
    adc1: number;
    adc2: number;
    adc3: number;
    adc4: number;
    rtc: number;
}
