// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';

import { ILogger } from './../services/logger/ILogger';
import { IRunMode } from './../services/runMode/IRunMode';
import { RunMode } from './../services/runMode/RunMode';
import { IEnvironment } from './../services/environment/IEnvironment';
import { Environment } from './../services/environment/Environment';
import { Logger } from '../services/logger/Logger';
import { Main } from '../Main';
import { ISample } from '../services/_samples/ISample';
import { SampleService } from './../services/_samples/SampleService';
import { IStartupArgs } from '../services/environment/IStartupArgs';
import { StartupArgs } from '../services/environment/StartupArgs';
import { Driver } from '../Driver';
import { EventsDeterminator } from '../EventsDeterminator';
import { PressDeterminator } from '../EventDeterminators/PressDeterminator';
import { Config } from '../Config';
import { StringKeyValuePairs } from "../StringKeyValuePairs";
import { CommandResolver } from '../CommandResolver';
import { Storage } from './../Storage';
import { IOsConfig } from '../IOsConfig';
import { CommandExecutor } from '../Executor';

const IoC = new Container();

try
{
    IoC.bind<SampleService>(SampleService).toSelf().whenTargetIsDefault(); // can be injected in constructor with any special helpers
    IoC.bind<ISample>(Types.ISample).to(SampleService).whenTargetIsDefault(); // can be injected with @inject(Types.ISample) in class constructor
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).whenTargetIsDefault();
    IoC.bind<IRunMode>(Types.IRunMode).to(RunMode).whenTargetIsDefault();
    IoC.bind<ILogger>(Types.ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Driver>(Driver).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<EventsDeterminator>(EventsDeterminator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<PressDeterminator>(PressDeterminator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<Config>(Config).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IOsConfig>(IOsConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<CommandResolver>(CommandResolver).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<CommandExecutor>(CommandExecutor).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<Storage<StringKeyValuePairs>>(Types.IStorage).to(Storage).inTransientScope().whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
