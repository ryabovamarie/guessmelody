import WelcomeScreen from './welcome-screen';
import changeView from './change-view';
import GameModel from './game-model';
import GameScreen from './game-screen';
import ResultScreen from './result-screen';

export default class Application {
  static showWelcome() {
    const welcome = new WelcomeScreen();
    changeView(welcome.element);
  }

  static showGame() {
    const model = new GameModel();
    const gameScreen = new GameScreen(model);
    gameScreen.startGame();
    changeView(gameScreen.element);
  }

  static showStats(gameResult) {
    const resultScreen = new ResultScreen(gameResult);
    changeView(resultScreen.element);
  }
}
