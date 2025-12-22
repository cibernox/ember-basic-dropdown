import type { BasicDropdownTriggerSignature } from '#src/components/basic-dropdown-trigger.gts';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export default <template>
  <span id="my-custom-trigger" ...attributes>My custom trigger</span>
</template> satisfies TemplateOnlyComponent<BasicDropdownTriggerSignature>;
