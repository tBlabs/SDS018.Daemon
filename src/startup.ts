#!/usr/bin/env node

import * as dotenv from 'dotenv';
dotenv.config(); // Loads variables from '.env' file to process.env

// Error.stackTraceLimit = 0;

import { IoC } from './IoC/IoC';
import { Main } from './Main';

(async () =>
{
    try
    {
        const main: Main = IoC.get(Main);
        await main.Run();
    }
    catch (error)
    {
        console.log('Startup exception:', error.message);
    }
})();
