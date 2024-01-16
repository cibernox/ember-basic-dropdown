import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

export interface BasicDropdownWormholeSignature {
  Element: Element;
}

export default class BasicDropdownWormholeComponent extends Component<BasicDropdownWormholeSignature> {
  get getDestinationId(): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const config = getOwner(this).resolveRegistration('config:environment') as {
      environment: string;
      APP: {
        rootElement: string;
      };
      'ember-basic-dropdown': {
        destination: string;
      };
    };

    if (config.environment === 'test') {
      const rootElement = config['APP']?.rootElement;
      return document.querySelector(rootElement)?.id ?? '';
    }

    return ((config['ember-basic-dropdown'] &&
      config['ember-basic-dropdown'].destination) ||
      'ember-basic-dropdown-wormhole') as string;
  }
}
