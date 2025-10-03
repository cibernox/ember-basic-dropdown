import Component from '@glimmer/component';
import { action } from '@ember/object';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked selected: string = '';

  @action
  preventUntilSelected() {
    if (!this.selected) {
      alert('You have to choose!');
      return false;
    }
  }

  <template>
    <BasicDropdown @onClose={{this.preventUntilSelected}} as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300">
        <p>
          Who you love more?
        </p>
        <p>
          <input
            type="radio"
            id="question-1"
            name="question"
            value="dat"
            {{on "change" (fn (mut this.selected) "dad")}}
          />
          <label for="question-1">Dad</label>
        </p>
        <p>
          <input
            type="radio"
            id="question-2"
            name="question"
            value="mom"
            {{on "change" (fn (mut this.selected) "mom")}}
          />
          <label for="question-2">Mom</label>
        </p>
      </dd.Content>
    </BasicDropdown>
  </template>
}
