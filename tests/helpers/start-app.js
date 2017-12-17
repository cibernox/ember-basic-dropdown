import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';
import nativeClick from './native-click'; // eslint-disable-line
import registerBasicDropdownHelpers from 'ember-basic-dropdown/test-support/helpers';

registerBasicDropdownHelpers();

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
