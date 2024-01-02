import Component from '@glimmer/component';
import { macroCondition, isTesting } from '@embroider/macros';
import config from 'ember-get-config';

export default class BasicDropdownWormholeComponent extends Component {
  get getDestinationId(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _config = config as unknown as any;

    if (macroCondition(isTesting())) {
      return document.querySelector(_config.APP.rootElement).id;
    }

    return ((_config['ember-basic-dropdown'] &&
      _config['ember-basic-dropdown'].destination) ||
      'ember-basic-dropdown-wormhole') as string;
  }
}
