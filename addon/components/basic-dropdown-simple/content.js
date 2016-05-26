import Ember from 'ember';
import layout from '../../templates/components/basic-dropdown-simple/content';
import config from 'ember-get-config';

const defaultDestination = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';

export default Ember.Component.extend({
  layout,
  tagName: '',
  to: Ember.testing ? 'ember-testing' : defaultDestination
});
