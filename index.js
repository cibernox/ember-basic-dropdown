/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-dropdown',
  contentFor: function(type, config) {
    if (config.environment !== 'test' && type === 'body-footer') {
      return '<div id="ember-dropdown-wormhole"></div>';
    }
  }
};
