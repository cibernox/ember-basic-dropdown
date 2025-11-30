import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { config as _config, _configSet } from '../config.js';
import { deprecate } from '@ember/debug';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class BasicDropdownWormholeComponent extends Component {
  get getDestinationId() {
    let config = _config;
    if (!_configSet) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const configEnvironment = getOwner(this).resolveRegistration('config:environment');
      if (configEnvironment['ember-basic-dropdown']) {
        const legacyConfigString = JSON.stringify(configEnvironment['ember-basic-dropdown']);
        deprecate(`You have configured \`ember-basic-dropdown\` in \`ember-cli-build.js\`. Remove that configuration and instead use \`import { setConfig } from 'ember-basic-dropdown/config'; setConfig(${legacyConfigString});`, false, {
          for: 'ember-basic-dropdown',
          id: 'ember-basic-dropdown.config-environment',
          since: {
            enabled: '8.9',
            available: '8.9'
          },
          until: '9.0.0'
        });
        config = configEnvironment['ember-basic-dropdown'];
      }
    }
    return config.destination || 'ember-basic-dropdown-wormhole';
  }
  static {
    setComponentTemplate(precompileTemplate("\n    <div id={{this.getDestinationId}} ...attributes></div>\n  ", {
      strictMode: true
    }), this);
  }
}

export { BasicDropdownWormholeComponent as default };
//# sourceMappingURL=basic-dropdown-wormhole.js.map
