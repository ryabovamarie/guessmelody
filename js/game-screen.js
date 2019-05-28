import HeaderView from './header-view';
import Application from './application';
import GameView from './game-view';
import changeView from './change-view';
import ConfirmView from './confirm-view';
import AbstractScreen from './abstract-screen';
import {TOTAL_QUESTIONS, ONE_SECOND} from './consts';
//  import Questions from './questions';

class Timer {
  start() {
    this.timerId = setTimeout(() => {
      this.onTick();
      this.start();
    }, ONE_SECOND);
  }

  stop() {
    clearTimeout(this.timerId);
  }

  onTick() {}
}

export default class GameScreen extends AbstractScreen {
  constructor(model) {
    super();
    this.model = model;
    this.headerView = new HeaderView(this.model);
    this.view = new GameView(this.headerView);
    this.timer = new Timer();
    this.confirmView = new ConfirmView();
    //  this.questions = JSON.parse(Questions);
    this._num = 0;

    this.timer.onTick = () => {
      if (!this.model.decreaseTimer()) {
        this.endGame();
      }
      this.headerView.changeTimer(this.model.minute, this.model.second);
    };

    this.confirmView.onRestartGame = () => {
      Application.showWelcome();
    };

    this.confirmView.onReturnToGame = () => {
      this.timer.start();
      changeView(this.element);
    };

    this.headerView.onNewGame = () => {
      this.timer.stop();
      changeView(this.confirmView.element);
    };
  }

  loadData() {
    return fetch(`https://es.dump.academy/guess-melody/questions`).
      then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return [];
        }
        throw new Error(`Неизвестный статус: ${response.status} ${response.statusText}`);
      }).
      then((data) => {
        this.questions = data;
      });
  }

  get nextQuestion() {
    if (this._num === TOTAL_QUESTIONS) {
      return undefined;
    }
    this._num++;
    return this.questions[this._num - 1];
  }

  startGame() {
    this.loadData().then(() => {
      this.changeQuestion();
      this.timer.start();
    });
    /*
    this.changeQuestion();
    this.timer.start();
    */
  }

  endGame() {
    this.timer.stop();
    Application.showStats(this.model.gameResult);
  }

  changeQuestion() {
    const question = this.nextQuestion;
    if (!question) {
      this.endGame();
      return;
    }
    const questionView = this.view.newQuestion(question);
    questionView.onAnswer = (answer) => {
      this.model.addAnswer(answer);
      if (!answer) {
        this.headerView.changeLives(this.model.lives);
      }
      if (this.model.lives === 0) {
        this.endGame();
      } else {
        this.changeQuestion();
      }
    };
  }
}
