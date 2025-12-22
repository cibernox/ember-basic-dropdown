import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export default <template>
  <span id="my-custom-trigger" ...attributes>My custom trigger</span>
</template> satisfies TemplateOnlyComponent<BasicDropdownTriggerSignature>;
