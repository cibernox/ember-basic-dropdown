import Application from '../../app';
import config from '../../config/environment';
import nativeClick from './native-click'; // jshint ignore:line
import run from 'ember-runloop';
import { assign } from 'ember-platform';

export default function startApp(attrs) {
  let application;

  let attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
