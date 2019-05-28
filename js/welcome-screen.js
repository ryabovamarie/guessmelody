import WelcomeView from './welcome-view';
import Application from './application';
import AbstractScreen from './abstract-screen';

export default class WelcomeScreen extends AbstractScreen {
  constructor() {
    super();
    this.view = new WelcomeView();
    this.view.onStartGame = Application.showGame;
  }
}
