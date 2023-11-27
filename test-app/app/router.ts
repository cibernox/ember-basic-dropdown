import EmberRouter from '@ember/routing/router';
import config from 'test-app/config/environment';

const Router = class extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
};

Router.map(function () {});

export default Router;
