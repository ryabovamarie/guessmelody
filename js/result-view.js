import AbstractView from './abstract-view';
import {RESULT_TYPE} from './consts';

export default class ResultView extends AbstractView {
  constructor(result) {
    super();
    this.result = result;
  }

  get _template() {
    return `<section class="result">
      <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
      <h2 class="result__title">${this.result.title}</h2>
      ${(this.result.type === RESULT_TYPE.OK) ?
    `<p class="result__total">${this.result.personal}</p>
        <p class="result__text">${this.result.text}</p>` :
    `<p class="result__total result__total--fail">${this.result.text}</p>`}
      <button class="result__replay" type="button">Сыграть ещё раз</button>
    </section>`;
  }

  _bind(element) {
    const button = element.querySelector(`.result__replay`);
    button.addEventListener(`click`, () => {
      this.onNewGame();
    });
  }

  onNewGame() {}
}
