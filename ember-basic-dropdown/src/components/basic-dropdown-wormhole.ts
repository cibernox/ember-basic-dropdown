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
      'ember-basic-dropdown'?: {
        destination?: string;
      };
    };

    return (
      (config['ember-basic-dropdown'] &&
        config['ember-basic-dropdown'].destination) ||
      'ember-basic-dropdown-wormhole'
    );
  }
}
