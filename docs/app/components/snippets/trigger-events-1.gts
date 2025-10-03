import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import BasicDropdown, { type BasicDropdownDefaultBlock } from 'ember-basic-dropdown/components/basic-dropdown';

export default class extends Component {
  openOnArrowDown(dropdown: BasicDropdownDefaultBlock, e: KeyboardEvent) {
    if (e.keyCode === 38) {
      dropdown.actions.open(e);
    }
  }

  <template>
    <input type="text" placeholder="Focus me and hit TAB to focus the trigger" />
    <br />
    <BasicDropdown as |dd|>
      <dd.Trigger
        class="trigger-bootstrap-feel"
        {{on "keydown" (fn this.openOnArrowDown dd)}}
      >
        Click me
      </dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300">
        Don't you love those little keys?
      </dd.Content>
    </BasicDropdown>
  </template>
}
