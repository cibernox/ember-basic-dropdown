clickTrigger();
assert.equal(
  document.querySelectorAll('.ember-basic-dropdown-content').length,
  1,
  'The content is shown now',
);
