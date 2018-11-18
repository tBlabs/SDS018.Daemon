// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';

import { Main } from '../Main';
import { Driver } from '../Driver/Driver';
import * as express from 'express';
import { IEnvironment } from '../services/env/IEnvironment';
import { Environment } from '../services/env/Environment';
import { StartupArgs } from '../services/env/StartupArgs';
import { IStartupArgs } from '../services/env/IStartupArgs';
import { Config } from '../Config';

const IoC = new Container();

try
{
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Environment>(Environment).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<StartupArgs>(StartupArgs).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Config>(Config).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Driver>(Driver).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types.ExpressServer).toConstantValue(express()).whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
