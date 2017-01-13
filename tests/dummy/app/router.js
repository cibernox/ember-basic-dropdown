import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('public-pages', { path: '' }, function() {
    this.route('docs', function() {
      this.route('installation');
      this.route('how-to-use-it');
      this.route('dropdown-events');
      this.route('trigger-events');
      this.route('content-events');
    });

    this.route('support-the-project');
  });

  this.route('legacy-demo');
});

export default Router;
