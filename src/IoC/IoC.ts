import { PressDeterminator } from './../Events/EventDeterminators/PressDeterminator';
// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';

import { Main } from '../Main';
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
import { IOsConfig } from '../Storage/IOsConfig';
import { CommandResolver } from '../Events/CommandResolver';
import { StringKeyValuePairs } from '../Storage/StringKeyValuePairs';
import { IController } from '../Controllers/IController';

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
    IoC.bind<IOsConfig>(IOsConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<AppConfig>(AppConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<CommandResolver>(CommandResolver).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<CommandResolver>(CommandResolver).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<EventsExecutor>(EventsExecutor).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<Storage<StringKeyValuePairs>>(Types.IStorage).to(Storage).inTransientScope().whenTargetIsDefault();
    IoC.bind<IController>(Types.IController).to(UserConfigController).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types.ExpressServer).toConstantValue(express()).whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
