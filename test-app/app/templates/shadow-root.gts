import RouteTemplate from 'ember-route-template';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

export default RouteTemplate(
  <template>
    <BasicDropdown as |dropdown|>
      <dropdown.Trigger>Open me, i'm in shadow</dropdown.Trigger>
      <dropdown.Content><h3>Content of the dropdown in shadow</h3></dropdown.Content>
    </BasicDropdown>
  </template>,
);
