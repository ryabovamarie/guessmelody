import AbstractView from './abstract-view';
import trackPlay from './track-play';

export default class GameGenreView extends AbstractView {
  constructor(question) {
    super();
    this.question = question;
  }

  get _template() {
    return `<section class="game__screen">
        <h2 class="game__title">${this.question.question}</h2>
        <form class="game__tracks">
          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[0].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-1">
              <label class="game__check" for="answer-1">Отметить</label>
            </div>
          </div>

          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[1].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-2">
              <label class="game__check" for="answer-2">Отметить</label>
            </div>
          </div>

          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[2].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-3">
              <label class="game__check" for="answer-3">Отметить</label>
            </div>
          </div>

          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[3].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-4">
              <label class="game__check" for="answer-4">Отметить</label>
            </div>
          </div>

          <button class="game__submit button" type="submit">Ответить</button>
        </form>
      </section>`;
  }

  _bind(element) {
    const buttonSubmit = element.querySelector(`.game__submit`);
    buttonSubmit.disabled = true;

    const trackElements = element.querySelectorAll(`.track`);
    let playing = {isOk: false};

    for (let trackElement of trackElements) {
      trackPlay(trackElement, playing);
    }

    let checkedCount = 0;
    let index = 0;
    const answerMap = new Map();

    for (let trackElement of trackElements) {
      const checkbox = trackElement.querySelector(`.game__input`);
      checkbox.isRight = this.question.answers[index].genre === this.question.genre;
      index++;

      answerMap.set(trackElement, !checkbox.isRight);

      checkbox.addEventListener(`click`, () => {
        if (checkbox.checked) {
          checkedCount++;
        } else {
          checkedCount--;
        }

        if ((checkbox.isRight && checkbox.checked) || (!checkbox.isRight && !checkbox.checked)) {
          answerMap.set(trackElement, true);
        } else {
          answerMap.set(trackElement, false);
        }

        if (checkedCount > 0) {
          buttonSubmit.disabled = false;
        } else {
          buttonSubmit.disabled = true;
        }
      });
    }

    buttonSubmit.addEventListener(`click`, () => {
      let answer = true;
      for (let value of answerMap.values()) {
        answer = answer & value;
      }
      this.onAnswer(answer);
    });
  }

  onAnswer() {}
}
