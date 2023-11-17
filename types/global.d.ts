// Types for compiled templates
declare module 'ember-basic-dropdown/templates/*' {
  // @ts-expect-error
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
