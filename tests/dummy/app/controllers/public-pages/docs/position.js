import Controller from '@ember/controller';
import Position1Component from '../../../components/snippets/position-1';
import Position2Component from '../../../components/snippets/position-2';
import Position3Component from '../../../components/snippets/position-3';

export default class extends Controller {
  position1Component = Position1Component;
  position2Component = Position2Component;
  position3Component = Position3Component;

  horizontalPosition = 'auto';
  verticalPosition = 'auto';
  buttonPosition = 'left';
  renderInPlace = false;
}
