import type { BasicDropdownContentSignature } from '#src/components/basic-dropdown-content.gts';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export default <template>
  <span id="my-custom-content" ...attributes>My custom content</span>
</template> satisfies TemplateOnlyComponent<BasicDropdownContentSignature>;
