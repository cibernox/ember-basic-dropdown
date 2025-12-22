import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { config as utilConfig, _configSet, type Config } from '../config.ts';
import { deprecate } from '@ember/debug';

export interface BasicDropdownWormholeSignature {
  Element: HTMLElement;
}

export default class BasicDropdownWormholeComponent extends Component<BasicDropdownWormholeSignature> {
  get getDestinationId(): string {
    let config = utilConfig;

    if (!_configSet) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const configEnvironment = getOwner(this).resolveRegistration(
        'config:environment',
      ) as {
        'ember-basic-dropdown'?: Config;
      };

      if (configEnvironment['ember-basic-dropdown']) {
        const legacyConfigString = JSON.stringify(
          configEnvironment['ember-basic-dropdown'],
        );
        deprecate(
          `You have configured \`ember-basic-dropdown\` in \`ember-cli-build.js\`. Remove that configuration and instead use \`import { setConfig } from 'ember-basic-dropdown/config'; setConfig(${legacyConfigString});`,
          false,
          {
            for: 'ember-basic-dropdown',
            id: 'ember-basic-dropdown.config-environment',
            since: {
              enabled: '8.9',
              available: '8.9',
            },
            until: '9.0.0',
          },
        );

        config = configEnvironment['ember-basic-dropdown'];
      }
    }

    return config.destination || 'ember-basic-dropdown-wormhole';
  }

  <template>
    <div id={{this.getDestinationId}} ...attributes></div>
  </template>
}
