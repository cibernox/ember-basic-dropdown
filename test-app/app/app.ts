import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'test-app/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { setConfig, type Config } from 'ember-basic-dropdown/config';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export const defaultBasicDropdownConfig: Config = {
  rootElement: config.APP['rootElement'] as string | undefined
}

setConfig(defaultBasicDropdownConfig);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
