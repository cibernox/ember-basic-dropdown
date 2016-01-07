import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('runloop');
  this.route('opening-closing-order');
  this.route('open-and-immediatly-close');
});

export default Router;
