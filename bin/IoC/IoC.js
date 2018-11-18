"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// These two imports must go first!
require("reflect-metadata");
const Types_1 = require("./Types");
const inversify_1 = require("inversify");
const Main_1 = require("../Main");
const Driver_1 = require("../Driver/Driver");
const express = require("express");
const StartupArgs_1 = require("../services/env/StartupArgs");
const Config_1 = require("../Config");
const Logger_1 = require("../services/logger/Logger");
const IoC = new inversify_1.Container();
exports.IoC = IoC;
try {
    IoC.bind(Main_1.Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(StartupArgs_1.StartupArgs).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Config_1.Config).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IStartupArgs).to(StartupArgs_1.StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Driver_1.Driver).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Logger_1.Logger).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.ExpressServer).toConstantValue(express()).whenTargetIsDefault();
}
catch (ex) {
    console.log('IoC exception:', ex);
}
//# sourceMappingURL=IoC.js.map