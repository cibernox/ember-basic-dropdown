import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

<template>
  <div class="scroll__container">
    <div class="scroll__scrolling-container">
      <div class="scroll__filler"></div>
      <div class="scroll__content-container">
        <div class="scroll__content">
          <BasicDropdown as |dd|>
            <dd.Trigger class="trigger-bootstrap-feel">Click me
              <span class="caret"></span></dd.Trigger>

            <dd.Content class="content-bootstrap-feel">
              <p>I look like bootstrap, right?</p>
              <p>You can style me however you want</p>
              <p>Option 3</p>
              <p>Option 4</p>
            </dd.Content>
          </BasicDropdown>
        </div>
      </div>
      <div class="scroll__filler"></div>
    </div>
  </div>
</template>
