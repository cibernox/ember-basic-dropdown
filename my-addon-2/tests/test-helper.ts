import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
// @ts-expect-error Could not find a declaration file for module '@embroider/macros/src/addon/runtime'.
import { getGlobalConfig } from '@embroider/macros/src/addon/runtime';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

class TestApp extends EmberApp {
  modules = {
    './router': Router,
    // add any custom services here
    // import.meta.glob('./services/*', { eager: true }),
  };
}

Router.map(function () {});

export function start() {
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const theMacrosGlobal = getGlobalConfig();
  //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  theMacrosGlobal['@embroider/macros'] ||= {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  theMacrosGlobal['@embroider/macros'].isTesting ||= true;

  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
