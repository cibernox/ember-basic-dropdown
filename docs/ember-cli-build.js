'use strict';
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/core/build-config');
  const { buildOnce } = await import('@embroider/vite');
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    autoImport: {
      watchDependencies: ['ember-basic-dropdown'],
    },
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
  });

  setConfig(app, __dirname, {
    // this should be the most recent <major>.<minor> version for
    // which all deprecations have been fully resolved
    // and should be updated when that changes
    compatWith: '5.8',
    deprecations: {
      // ... list individual deprecations that have been resolved here
    },
  });

  return compatBuild(app, buildOnce);
};
