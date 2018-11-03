#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config(); // Loads variables from '.env' file to process.env
// Error.stackTraceLimit = 0;
const IoC_1 = require("./IoC/IoC");
const Main_1 = require("./Main");
(async () => {
    try {
        const main = IoC_1.IoC.get(Main_1.Main);
        await main.Run();
    }
    catch (ex) {
        console.log('Startup exception:', ex);
    }
})();
//# sourceMappingURL=startup.js.map