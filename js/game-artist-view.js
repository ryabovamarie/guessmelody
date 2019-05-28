import AbstractView from './abstract-view';
import imageTemplate from './image-template';
import trackPlay from './track-play';

export default class GameArtistView extends AbstractView {
  constructor(question) {
    super();
    this.question = question;
  }

  get _template() {
    return `<section class="game__screen">
        <h2 class="game__title">${this.question.question}</h2>
        <div class="game__track">
          <button class="track__button track__button--play" type="button"></button>
          <audio src="${this.question.src}"></audio>
        </div>

        <form class="game__artist">
          <div class="artist">
            <input class="artist__input visually-hidden" type="radio" name="answer" value="artist-1" id="answer-1">
            <label class="artist__name" for="answer-1">
              ${imageTemplate(this.question.answers[0].image, this.question.answers[0].title)}
              ${this.question.answers[0].title}
            </label>
          </div>

          <div class="artist">
            <input class="artist__input visually-hidden" type="radio" name="answer" value="artist-2" id="answer-2">
            <label class="artist__name" for="answer-2">
              ${imageTemplate(this.question.answers[1].image, this.question.answers[1].title)}
              ${this.question.answers[1].title}
            </label>
          </div>

          <div class="artist">
            <input class="artist__input visually-hidden" type="radio" name="answer" value="artist-3" id="answer-3">
            <label class="artist__name" for="answer-3">
              ${imageTemplate(this.question.answers[2].image, this.question.answers[2].title)}
              ${this.question.answers[2].title}
            </label>
          </div>
        </form>
      </section>`;
  }

  _bind(element) {
    const radioboxes = element.querySelectorAll(`.artist__input`);
    let index = 0;

    for (let radio of radioboxes) {
      radio.isOk = this.question.answers[index].isCorrect;
      radio.addEventListener(`click`, () => {
        if (radio.checked) {
          this.onAnswer(radio.isOk);
        }
      });
      index++;
    }

    const trackElement = element.querySelector(`.game__track`);
    trackPlay(trackElement, {isOk: false});
  }

  onAnswer() { }
}
