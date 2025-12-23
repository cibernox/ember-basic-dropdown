import Component from '@glimmer/component';
import { getConfig } from '../config.ts';

export interface BasicDropdownWormholeSignature {
  Element: HTMLElement;
}

export default class BasicDropdownWormholeComponent extends Component<BasicDropdownWormholeSignature> {
  get getDestinationId(): string {
    const config = getConfig();

    return config.destination || 'ember-basic-dropdown-wormhole';
  }

  <template>
    <div id={{this.getDestinationId}} ...attributes></div>
  </template>
}
