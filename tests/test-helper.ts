import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setConfig, type Config } from '#src/config.ts';
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

// let createdApp = null;

// // @ts-expect-error Public property 'isFastBoot' of exported class
// const isFastBoot = typeof FastBoot !== 'undefined';

// export function initializeShadowDom() {
//   if (isFastBoot || import.meta.env.VITE_SHADOW_DOM_BUILD !== 'true') {
//     return;
//   }

//   const targetElement = document.getElementById('ember-testing');

//   // customElements.define(
//   //   'shadow-root',
//   //   class extends HTMLElement {
//   //     connectedCallback() {
//   //       this.attachShadow({ mode: 'open' });
//   //     }
//   //   },
//   // );

//   const hostElement = document.createElement('div');
//   hostElement.attachShadow({ mode: 'open' });

//   const rootElement = document.createElement('div');
//   const wormhole = document.createElement('div');
//   wormhole.id = 'ember-basic-dropdown-wormhole';

//   hostElement.shadowRoot?.appendChild(wormhole);
//   hostElement.shadowRoot?.appendChild(rootElement);
//   targetElement?.appendChild(hostElement);

//   setConfig({
//     rootElement: '#ember-basic-dropdown-wormhole',
//   });

//   console.log(createdApp);

//   createdApp.rootElement = hostElement.shadowRoot;

//   console.log(createdApp.rootElement);
// }

export function start() {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const config = getGlobalConfig()['@embroider/macros'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (config) config.isTesting = true;

  setConfig(defaultBasicDropdownConfig);
  qunitStart();
}

export const defaultBasicDropdownConfig: Config = {
  rootElement:
    import.meta.env.VITE_SHADOW_DOM_BUILD === 'true'
      ? '#ember-basic-dropdown-wormhole'
      : '#ember-testing',
};
