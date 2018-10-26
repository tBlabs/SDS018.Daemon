import { Event } from '../Events/Event';
import { Command } from "./Command";

export type IoEvents = {
    [key in Event]: Command;
} | {};