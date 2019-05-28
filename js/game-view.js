import AbstractView from './abstract-view';
import {QUESTION_TYPE} from './consts';
import GameGenreView from './game-genre-view';
import GameArtistView from './game-artist-view';

export default class GameView extends AbstractView {
  constructor(headerView) {
    super();
    this.headerView = headerView;
  }

  get element() {
    if (this._element) {
      return this._element;
    }
    this._element = document.createElement(`section`);
    this._element.classList.add(`game`);
    this._element.appendChild(this.headerView.element);
    return this._element;
  }

  newQuestion(question) {
    const wrongClass = (question.type === QUESTION_TYPE.ARTIST) ? `game--genre` : `game--artist`;
    const questionView = (question.type === QUESTION_TYPE.ARTIST) ? new GameArtistView(question) : new GameGenreView(question);
    this.element.classList.remove(wrongClass);
    this.element.classList.add(`game--${question.type}`);
    if (this.element.children.length > 1) {
      this.element.removeChild(this.element.lastChild);
    }
    this.element.appendChild(questionView.element);
    return questionView;
  }
}
