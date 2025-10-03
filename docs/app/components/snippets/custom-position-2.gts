import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import type { CalculatePositionOptions, CalculatePositionResult } from 'ember-basic-dropdown/utils/calculate-position';
import { action } from '@ember/object';

const NAMES = ['Katie', 'Ricardo', 'Igor', 'Alex', 'Martin', 'Godfrey'];

export default class extends Component {
  @tracked names: string[] = [];

  calculatePosition(trigger: Element, content: HTMLElement, _destination: HTMLElement, { horizontalPosition, verticalPosition }: CalculatePositionOptions): CalculatePositionResult {
    const { top, left, width, height } = trigger.getBoundingClientRect();
    const { height: contentHeight } = content.getBoundingClientRect();
    const style = {
      left: left + width,
      top: top + window.pageYOffset + height / 2 - contentHeight / 2,
    };

    return { horizontalPosition, verticalPosition, style };
  }

  addNames = task(async () => {
    this.names = [];
    for (const name of NAMES) {
      this.names = [...this.names, name];
      await timeout(750);
    }
  });

  @action
  open() {
    void this.addNames.perform();
  }

  <template>
    <BasicDropdown
      @calculatePosition={{this.calculatePosition}}
      @onOpen={{this.open}}
      as |dd|
    >
      <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>

      <dd.Content class="content-bootstrap-feel arrow-left-content">
        {{#each this.names as |name|}}
          {{name}}
          <br />
        {{/each}}
      </dd.Content>
    </BasicDropdown>
  </template>
}
