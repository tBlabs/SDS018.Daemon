import { Event } from './Event';
import { Command } from "./Command";

export type IoEvents = {
    [key in Event]: Command;
} | {};