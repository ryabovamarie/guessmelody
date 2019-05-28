import AbstractView from './abstract-view';
import {TOTAL_TIME, CIRCLE_LENGTH, TOTAL_LIVES} from './consts';

export default class HeaderView extends AbstractView {
  constructor(model) {
    super();
    this.model = model;
  }

  get _template() {
    return `<header class="game__header">
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="./img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" stroke-dasharray="${CIRCLE_LENGTH}" cx="390" cy="390" r="370" style="filter: url(#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
      </svg>

      <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer__mins">${this.model.minute}</span>
        <span class="timer__dots">:</span>
        <span class="timer__secs">${(this.model.second < 10) ? `0` : ``}${this.model.second}</span>
      </div>

      <div class="game__mistakes">
        ${new Array(TOTAL_LIVES + 1 - this.model.lives).join(`<div class="wrong"></div>`)}
      </div>
    </header>`;
  }

  _bind(element) {
    const buttonBack = element.querySelector(`.game__back`);

    buttonBack.addEventListener(`click`, this.onNewGame);

    this.minsElement = element.querySelector(`.timer__mins`);
    this.secsElement = element.querySelector(`.timer__secs`);
    this.mistakesElement = element.querySelector(`.game__mistakes`);
    this.timerLine = element.querySelector(`.timer__line`);
  }

  onNewGame() {}

  changeLives(lives) {
    this.mistakesElement.innerHTML = `${new Array(TOTAL_LIVES + 1 - lives).join(`<div class="wrong"></div>`)}`;
  }

  changeTimer(minute, second) {
    this.minsElement.innerHTML = minute;
    this.secsElement.innerHTML = `${(second < 10) ? `0` : ``}${second}`;
    this.timerLine.style.strokeDashoffset = Math.round(CIRCLE_LENGTH * (TOTAL_TIME - minute * 60 - second) / TOTAL_TIME);
  }
}
