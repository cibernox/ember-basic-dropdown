import BasicDropdown from "ember-basic-dropdown/components/basic-dropdown";

<template>
  <h1>Helpers testing</h1>

  <div class="dropdown-0-wrapper">
    <BasicDropdown as |dd|>
      <dd.Trigger class="dropdown-0">
        Click me
      </dd.Trigger>
      <dd.Content>
        Hello world 0!
      </dd.Content>
    </BasicDropdown>
  </div>

  <div class="dropdown-1-wrapper">
    <BasicDropdown as |dd|>
      <dd.Trigger class="dropdown-1">
        Click me
      </dd.Trigger>
      <dd.Content>
        Hello world 1!
      </dd.Content>
    </BasicDropdown>
  </div>
</template>
