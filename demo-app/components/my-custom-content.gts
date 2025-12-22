import type { BasicDropdownContentSignature } from 'ember-basic-dropdown/components/basic-dropdown-content';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export default <template>
  <span id="my-custom-content" ...attributes>My custom content</span>
</template> satisfies TemplateOnlyComponent<BasicDropdownContentSignature>;
