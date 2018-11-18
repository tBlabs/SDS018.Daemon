#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoC_1 = require("./IoC/IoC");
const Main_1 = require("./Main");
(async () => {
    try {
        const main = IoC_1.IoC.get(Main_1.Main);
        await main.Run();
    }
    catch (error) {
        console.log('Startup exception:', error.message);
    }
})();
//# sourceMappingURL=startup.js.map