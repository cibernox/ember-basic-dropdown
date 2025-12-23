import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import type {
  CalculatePositionOptions,
  CalculatePositionResult,
} from 'ember-basic-dropdown/utils/calculate-position';

export default class extends Component {
  calculatePosition(
    trigger: HTMLElement,
    content: HTMLElement,
    _destination: HTMLElement,
    { horizontalPosition, verticalPosition }: CalculatePositionOptions
  ): CalculatePositionResult {
    const { top, left, width, height } = trigger.getBoundingClientRect();
    const { height: contentHeight } = content.getBoundingClientRect();
    const style = {
      left: left + width,
      top: top + window.pageYOffset + height / 2 - contentHeight / 2,
    };

    return { horizontalPosition, verticalPosition, style };
  }

  <template>
    <BasicDropdown @calculatePosition={{this.calculatePosition}} as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>

      <dd.Content class="content-bootstrap-feel arrow-left-content">
        Hello from the right!
        <br />
        See? It wasn't that hard.
      </dd.Content>
    </BasicDropdown>
  </template>
}
