"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// These two imports must go first!
require("reflect-metadata");
const Types_1 = require("./Types");
const inversify_1 = require("inversify");
const Main_1 = require("../Main");
const PressDeterminator_1 = require("./../Events/EventDeterminators/PressDeterminator");
const StartupArgs_1 = require("../services/environment/StartupArgs");
const Driver_1 = require("../Driver/Driver");
const EventsDeterminator_1 = require("../Events/EventsDeterminator");
const UserConfig_1 = require("../Storage/UserConfig");
const Storage_1 = require("../Storage/Storage");
const AppConfig_1 = require("../Storage/AppConfig");
const EventsExecutor_1 = require("../Events/EventsExecutor");
const express = require("express");
const UserConfigController_1 = require("../Controllers/UserConfigController");
const Environment_1 = require("../services/environment/Environment");
const IoConfig_1 = require("../Storage/IoConfig");
const CommandResolver_1 = require("../Events/CommandResolver");
const CommandExecutor_1 = require("../Events/CommandExecutor");
const IoConfigController_1 = require("../Controllers/IoConfigController");
const DriverController_1 = require("../Controllers/DriverController");
const ProcessRunner_1 = require("../Events/Runners/ProcessRunner");
const HttpRunner_1 = require("../Events/Runners/HttpRunner");
const IoC = new inversify_1.Container();
exports.IoC = IoC;
try {
    IoC.bind(Types_1.Types.IEnvironment).to(Environment_1.Environment).whenTargetIsDefault();
    IoC.bind(Main_1.Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IStartupArgs).to(StartupArgs_1.StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Driver_1.Driver).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(EventsDeterminator_1.EventsDeterminator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(PressDeterminator_1.PressDeterminator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(UserConfig_1.UserConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(IoConfig_1.IoConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(AppConfig_1.AppConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(CommandResolver_1.CommandResolver).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(CommandExecutor_1.CommandExecutor).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(EventsExecutor_1.EventsExecutor).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IStorage).to(Storage_1.Storage).inTransientScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IController).to(UserConfigController_1.UserConfigController).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IController).to(IoConfigController_1.IoConfigController).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IController).to(DriverController_1.DriverController).inSingletonScope().whenTargetIsDefault();
    IoC.bind(ProcessRunner_1.ProcessRunner).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(HttpRunner_1.HttpRunner).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.ExpressServer).toConstantValue(express()).whenTargetIsDefault();
}
catch (ex) {
    console.log('IoC exception:', ex);
}
//# sourceMappingURL=IoC.js.map