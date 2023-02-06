import Controller from '@ember/controller';
import HowToUseIt1Component from '../../../components/snippets/how-to-use-it-1';
import HowToUseIt2Component from '../../../components/snippets/how-to-use-it-2';
import HowToUseIt3Component from '../../../components/snippets/how-to-use-it-3';

export default class extends Controller {
  howToUseIt1Component = HowToUseIt1Component;
  howToUseIt2Component = HowToUseIt2Component;
  howToUseIt3Component = HowToUseIt3Component;
}
