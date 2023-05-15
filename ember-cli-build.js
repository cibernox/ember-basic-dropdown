'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const crawl = require('prember-crawler');

module.exports = function (defaults) {
  let options = {
    snippetPaths: [
      'tests/dummy/app/components/snippets',
      'tests/dummy/app/templates/snippets',
    ],
    'ember-prism': {
      components: ['scss', 'javascript'], //needs to be an array, or undefined.
    },
    prember: {
      urls: crawl,
    },
  };

  let app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
