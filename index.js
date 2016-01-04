/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-basic-dropdown',
  contentFor: function(type, config) {
    if (config.environment !== 'test' && type === 'body-footer' && !config._emberBasicDropdownContentForInvoked) {
      config._emberBasicDropdownContentForInvoked = true;
      return '<div id="ember-basic-dropdown-wormhole"></div>';
    }
  }
};
