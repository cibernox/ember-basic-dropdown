import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export default class extends Component {
  focusInput = modifier((input) => {
    input.focus();
  });
}
