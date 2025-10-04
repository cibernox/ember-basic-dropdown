import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

<template>
  <BasicDropdown @disabled={{true}} as |dd|>
    <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>

    <dd.Content class="content-bootstrap-feel">
      You can't see this
    </dd.Content>
  </BasicDropdown>
</template>
