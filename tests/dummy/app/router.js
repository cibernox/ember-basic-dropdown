import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('public-pages', { path: '' }, function() {
    this.route('docs', function() {
      // Getting started
      // index.hbs is "Overview"
      this.route('installation');
      this.route('how-to-use-it');
      this.route('dropdown-events');
      this.route('trigger-events');
      this.route('content-events');

      // Basic customization
      this.route('position');
      this.route('disabled');
      this.route('overlays');
      this.route('styles');

      // Advanced customization
      this.route('custom-position');
      this.route('animations');

      // Other
      this.route('test-helpers');
      this.route('api-reference');
    });

    this.route('cookbook', function() {
      this.route('no-trigger');
    });

    this.route('addons', function() {
    });

    this.route('support-the-project');
  });

  this.route('legacy-demo');
});

export default Router;
