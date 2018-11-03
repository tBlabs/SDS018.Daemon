// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';

import { Main } from '../Main';
import { PressDeterminator } from './../Events/EventDeterminators/PressDeterminator';
import { IStartupArgs } from '../services/environment/IStartupArgs';
import { StartupArgs } from '../services/environment/StartupArgs';
import { Driver } from '../Driver/Driver';
import { EventsDeterminator } from '../Events/EventsDeterminator';
import { UserConfig } from '../Storage/UserConfig';
import { Storage } from '../Storage/Storage';
import { AppConfig } from '../Storage/AppConfig';
import { EventsExecutor } from '../Events/EventsExecutor';
import * as express from 'express';
import { UserConfigController } from '../Controllers/UserConfigController';
import { IEnvironment } from '../services/environment/IEnvironment';
import { Environment } from '../services/environment/Environment';
import { IoConfig } from '../Storage/IoConfig';
import { CommandResolver } from '../Events/CommandResolver';
import { StringKeyValuePairs } from '../Storage/StringKeyValuePairs';
import { IController } from '../Controllers/IController';
import { CommandExecutor } from '../Events/CommandExecutor';
import { IoConfigController } from '../Controllers/IoConfigController';
import { DriverController } from '../Controllers/DriverController';
import { ProcessRunner } from '../Events/Runners/ProcessRunner';
import { HttpRunner } from '../Events/Runners/HttpRunner';

const IoC = new Container();

try
{
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Driver>(Driver).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<EventsDeterminator>(EventsDeterminator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<PressDeterminator>(PressDeterminator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<UserConfig>(UserConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IoConfig>(IoConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<AppConfig>(AppConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<CommandResolver>(CommandResolver).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<CommandExecutor>(CommandExecutor).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<EventsExecutor>(EventsExecutor).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<Storage<StringKeyValuePairs>>(Types.IStorage).to(Storage).inTransientScope().whenTargetIsDefault();
    IoC.bind<IController>(Types.IController).to(UserConfigController).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IController>(Types.IController).to(IoConfigController).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IController>(Types.IController).to(DriverController).inSingletonScope().whenTargetIsDefault();
    IoC.bind<ProcessRunner>(ProcessRunner).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<HttpRunner>(HttpRunner).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(Types.ExpressServer).toConstantValue(express()).whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
