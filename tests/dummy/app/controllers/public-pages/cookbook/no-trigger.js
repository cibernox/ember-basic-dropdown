import Controller from '@ember/controller';
import NoTrigger1Component from '../../../components/snippets/no-trigger-1';
import NoTrigger2Component from '../../../components/snippets/no-trigger-2';

export default class extends Controller {
  noTrigger1Component = NoTrigger1Component;
  noTrigger2Component = NoTrigger2Component;
}
