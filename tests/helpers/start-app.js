import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';
import nativeClick from './native-click'; // eslint-disable-line
import registerBasicDropdownHelpers from '../../tests/helpers/ember-basic-dropdown';

registerBasicDropdownHelpers();

export default function startApp(attrs) {
  let attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
