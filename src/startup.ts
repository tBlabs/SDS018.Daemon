#!/usr/bin/env node

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
