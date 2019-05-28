import getScore from './get-score';
import {TOTAL_TIME, TOTAL_LIVES} from './consts';

export default class GameModel {
  constructor() {
    this.lives = TOTAL_LIVES;
    this._time = TOTAL_TIME;
    this._lastAnswerTime = TOTAL_TIME;
    this._answers = [];
  }

  addAnswer(answer) {
    if (!answer) {
      this.lives--;
    }
    this._answers.push({isOk: answer, time: this._lastAnswerTime - this._time});
    this._lastAnswerTime = this._time;
  }

  get gameResult() {
    return {
      score: getScore(this._answers, this.lives),
      lives: this.lives,
      restTime: this._time
    };
  }

  get timeDiff() {
    const timeDiff = this._lastAnswerTime - this._time;
    this._lastAnswerTime = this._time;
    return timeDiff;
  }

  set time(time) {
    if (time >= 0) {
      this._time = time;
    }
  }

  decreaseTimer() {
    this._time--;
    return this._time;
  }

  get minute() {
    return Math.floor(this._time / 60);
  }

  get second() {
    return this._time % 60;
  }
}
