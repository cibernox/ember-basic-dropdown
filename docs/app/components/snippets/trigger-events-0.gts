import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

<template>
  <div style="display: flex;">
    <div style="flex: 1;">
      <BasicDropdown as |dd|>
        <dd.Trigger
          class="trigger-bootstrap-feel"
          @eventType="mousedown"
        >
          Mousedown (default)
        </dd.Trigger>

        <dd.Content class="content-bootstrap-feel width-300">
          I open as soon as you press the mouse button
        </dd.Content>
      </BasicDropdown>
    </div>
    <div style="flex: 1;">
      <BasicDropdown as |dd|>
        <dd.Trigger class="trigger-bootstrap-feel">Click</dd.Trigger>

        <dd.Content class="content-bootstrap-feel width-300">
          I only open when you release the mouse button
        </dd.Content>
      </BasicDropdown>
    </div>
  </div>
</template>
