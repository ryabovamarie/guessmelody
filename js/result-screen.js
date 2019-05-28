import getResult from './get-result';
import getPersonalResult from './get-personal-result';
import ResultView from './result-view';
import Application from './application';
import AbstractScreen from './abstract-screen';

export default class ResultScreen extends AbstractScreen {
  constructor(gameResult) {
    super();
    const result = getResult([], gameResult);
    result.personal = getPersonalResult(gameResult);
    this.view = new ResultView(result);
    this.view.onNewGame = () => {
      Application.showWelcome();
    };
  }
}
