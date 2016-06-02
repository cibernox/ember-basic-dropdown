/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-basic-dropdown',

  included: function(appOrAddon) {
    var app = appOrAddon.app || appOrAddon;
    if (!app.__emberBasicDropdownIncludedInvoked) {
      app.__emberBasicDropdownIncludedInvoked = true;
      this._super.included.apply(this, arguments);
      // Don't include the precompiled css file if the user uses ember-cli-sass
      if (!app.registry.availablePlugins['ember-cli-sass']) {
        if (!app.__skipEmberBasicDropdownStyles) {
          app.import('vendor/ember-basic-dropdown.css');
        }
      }
    }
  },

  contentFor: function(type, config) {
    var basicDropdownConfig = config['ember-basic-dropdown'];
    if (!basicDropdownConfig || !basicDropdownConfig.destination) {
      if (config.environment !== 'test' && type === 'body-footer' && !config._emberBasicDropdownContentForInvoked) {
        config._emberBasicDropdownContentForInvoked = true;
        return '<div id="ember-basic-dropdown-wormhole"></div>';
      }
    }
  }
};
