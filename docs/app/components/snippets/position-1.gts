import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { eq, not } from 'ember-truth-helpers';
import type {
  HorizontalPosition,
  VerticalPosition,
} from 'ember-basic-dropdown/types';

export default class extends Component {
  horizontalPosition: HorizontalPosition = 'auto';
  verticalPosition: VerticalPosition = 'auto';
  buttonPosition = 'left';
  renderInPlace = false;

  <template>
    horizontalPosition:
    {{this.horizontalPosition}}
    verticalPosition:
    {{this.verticalPosition}}
    buttonPosition:
    {{this.buttonPosition}}
    <div class="flex content-pull-{{this.buttonPosition}}">
      {{#if this.renderInPlace}}
        <BasicDropdown
          @horizontalPosition={{this.horizontalPosition}}
          @verticalPosition={{this.verticalPosition}}
          @renderInPlace={{true}}
          as |dd|
        >
          <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>
          <dd.Content class="content-bootstrap-feel">
            <img src="/lts.png" alt="tomster" />
          </dd.Content>
        </BasicDropdown>
      {{else}}
        <BasicDropdown
          @horizontalPosition={{this.horizontalPosition}}
          @verticalPosition={{this.verticalPosition}}
          as |dd|
        >
          <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>
          <dd.Content class="content-bootstrap-feel">
            <img src="/lts.png" alt="tomster" />
          </dd.Content>
        </BasicDropdown>
      {{/if}}
    </div>
    <p>
      Horizontal
      <br />
      <input
        type="radio"
        id="h-auto"
        checked={{eq this.horizontalPosition "auto"}}
        {{on "change" (fn (mut this.horizontalPosition) "auto")}}
      />
      <label for="h-auto">auto</label>
      <input
        type="radio"
        id="h-auto-right"
        checked={{eq this.horizontalPosition "auto-right"}}
        {{on "change" (fn (mut this.horizontalPosition) "auto-right")}}
      />
      <label for="h-auto-right">auto-right</label>
      <input
        type="radio"
        id="h-left"
        checked={{eq this.horizontalPosition "left"}}
        {{on "change" (fn (mut this.horizontalPosition) "left")}}
      />
      <label for="h-left">left</label>
      <input
        type="radio"
        id="h-center"
        checked={{eq this.horizontalPosition "center"}}
        {{on "change" (fn (mut this.horizontalPosition) "center")}}
      />
      <label for="h-center">center</label>
      <input
        type="radio"
        id="h-right"
        checked={{eq this.horizontalPosition "right"}}
        {{on "change" (fn (mut this.horizontalPosition) "right")}}
      />
      <label for="h-right">right</label>
    </p>
    <p>
      Vertical
      <br />
      <input
        type="radio"
        id="v-auto"
        checked={{eq this.verticalPosition "auto"}}
        {{on "change" (fn (mut this.verticalPosition) "auto")}}
      />
      <label for="v-auto">auto</label>
      <input
        type="radio"
        id="v-above"
        checked={{eq this.verticalPosition "above"}}
        {{on "change" (fn (mut this.verticalPosition) "above")}}
      />
      <label for="v-above">above</label>
      <input
        type="radio"
        id="v-below"
        checked={{eq this.verticalPosition "below"}}
        {{on "change" (fn (mut this.verticalPosition) "below")}}
      />
      <label for="v-below">below</label>
    </p>
    <p>
      Button position
      <br />
      <input
        type="radio"
        id="btn-pos-left"
        checked={{eq this.buttonPosition "left"}}
        {{on "change" (fn (mut this.buttonPosition) "left")}}
      />
      <label for="btn-pos-left">left</label>
      <input
        type="radio"
        id="btn-pos-right"
        checked={{eq this.buttonPosition "right"}}
        {{on "change" (fn (mut this.buttonPosition) "right")}}
      />
      <label for="btn-pos-right">right</label>
    </p>

    <p>
      RenderInPlace
      <br />
      <input
        type="checkbox"
        id="config-render-in-lace"
        checked={{eq this.renderInPlace "left"}}
        {{on "change" (fn (mut this.renderInPlace) (not this.renderInPlace))}}
      />
      <label for="config-render-in-lace">Render in-place</label>
    </p>
  </template>
}
