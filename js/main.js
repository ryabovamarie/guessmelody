(function () {
  'use strict';

  class AbstractView {
    constructor() {}

    get _template() {}

    _render() {
      const element = document.createElement(`template`);
      element.innerHTML = this._template;
      return element.content.firstChild;
    }

    _bind() {}

    get element() {
      if (this._element) {
        return this._element;
      }
      this._element = this._render();
      this._bind(this._element);
      return this._element;
    }
  }

  class WelcomeView extends AbstractView {
    get _template() {
      return `<section class="welcome">
      <div class="welcome__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
        <button class="welcome__button"><span class="visually-hidden">Начать игру</span></button>
        <h2 class="welcome__rules-title">Правила игры</h2>
        <p class="welcome__text">Правила просты:</p>
        <ul class="welcome__rules-list">
          <li>За 5 минут нужно ответить на все вопросы.</li>
          <li>Можно допустить 3 ошибки.</li>
        </ul>
        <p class="welcome__text">Удачи!</p>
    </section>`;
    }

    _bind(element) {
      const button = element.querySelector(`.welcome__button`);
      button.addEventListener(`click`, () => {
        this.onStartGame();
      });
    }

    onStartGame() {}
  }

  class AbstractScreen {
    constructor() {}

    get element() {
      return this.view.element;
    }
  }

  class WelcomeScreen extends AbstractScreen {
    constructor() {
      super();
      this.view = new WelcomeView();
      this.view.onStartGame = Application.showGame;
    }
  }

  function changeView(element) {
    const main = document.querySelector(`.main`);
    main.innerHTML = ``;
    main.appendChild(element);
  }

  const ONE_SECOND = 1000;
  const TOTAL_TIME = 300;
  const TOTAL_LIVES = 3;
  const TOTAL_QUESTIONS = 10;
  const CIRCLE_LENGTH = 2325;

  const RESULT_TYPE = {
    OK: `success`,
    FAIL: `fail`
  };

  const QUESTION_TYPE = {
    GENRE: `genre`,
    ARTIST: `artist`
  };

  function getScore(answers, lives) {
    if (answers.length < TOTAL_QUESTIONS || lives === 0) {
      return -1;
    }
    return answers.reduce((score, item) => {
      const timeScore = item.time < 30 ? 2 : 1;
      return score + (item.isOk ? timeScore : -2);
    }, 0);
  }

  class GameModel {
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

  class HeaderView extends AbstractView {
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

  function trackPlay(trackElement, playing) {
    const trackButton = trackElement.querySelector(`.track__button`);
    const trackAudio = trackElement.querySelector(`audio`);
    trackButton.addEventListener(`click`, () => {
      if (trackButton.classList.contains(`track__button--play`)) {
        trackButton.classList.remove(`track__button--play`);
        trackButton.classList.add(`track__button--pause`);
        if (!playing.isOk) {
          playing.isOk = true;
        } else {
          trackPause(playing.element);
        }
        playing.element = trackElement;
        trackAudio.play();
      } else if (trackButton.classList.contains(`track__button--pause`)) {
        trackPause(trackElement);
        playing.isOk = false;
        playing.element = null;
      }
    });
  }

  function trackPause(trackElement) {
    const trackButton = trackElement.querySelector(`.track__button`);
    const trackAudio = trackElement.querySelector(`audio`);
    trackButton.classList.remove(`track__button--pause`);
    trackButton.classList.add(`track__button--play`);
    trackAudio.pause();
  }

  class GameGenreView extends AbstractView {
    constructor(question) {
      super();
      this.question = question;
    }

    get _template() {
      return `<section class="game__screen">
        <h2 class="game__title">${this.question.question}</h2>
        <form class="game__tracks">
          <div class="track">
            <button class="track__button track__button--pause" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[0].src}" autoplay></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-1">
              <label class="game__check" for="answer-1" ${``}>
                Отметить
              </label>
            </div>
          </div>

          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[1].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-2">
              <label class="game__check" for="answer-2" ${``}>
                Отметить
              </label>
            </div>
          </div>

          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[2].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-3">
              <label class="game__check" for="answer-3" ${``}>
                Отметить
              </label>
            </div>
          </div>

          <div class="track">
            <button class="track__button track__button--play" type="button"></button>
            <div class="track__status">
              <audio src="${this.question.answers[3].src}"></audio>
            </div>
            <div class="game__answer">
              <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="answer-4">
              <label class="game__check" for="answer-4" ${``}>
                Отметить
              </label>
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
      let playing = {isOk: true, element: trackElements[0]};

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

  function imageTemplate(image, alt) {
    return `<img class="artist__picture"
    src="${image.url}" alt="${alt}" width="${image.width}" height="${image.height}"></img>`;
  }

  class GameArtistView extends AbstractView {
    constructor(question) {
      super();
      this.question = question;
    }

    get _template() {
      return `<section class="game__screen">
        <h2 class="game__title">${this.question.question}</h2>
        <div class="game__track">
          <button class="track__button track__button--pause" type="button"></button>
          <audio src="${this.question.src}" autoplay></audio>
        </div>

        <form class="game__artist">
          <div class="artist" ${``}>
            <input class="artist__input visually-hidden" type="radio" name="answer" value="artist-1" id="answer-1">
            <label class="artist__name" for="answer-1">
              ${imageTemplate(this.question.answers[0].image, this.question.answers[0].title)}
              ${this.question.answers[0].title}
            </label>
          </div>

          <div class="artist" ${``}>
            <input class="artist__input visually-hidden" type="radio" name="answer" value="artist-2" id="answer-2">
            <label class="artist__name" for="answer-2">
              ${imageTemplate(this.question.answers[1].image, this.question.answers[1].title)}
              ${this.question.answers[1].title}
            </label>
          </div>

          <div class="artist" ${``}>
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
      trackPlay(trackElement, {isOk: true, element: trackElement});
    }

    onAnswer() { }
  }

  class GameView extends AbstractView {
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

  class ConfirmView extends AbstractView {
    get _template() {
      return `<section class="modal">
      <button class="modal__close" type="button"><span class="visually-hidden">Закрыть</span></button>
      <h2 class="modal__title">Подтверждение</h2>
      <p class="modal__text">Вы уверены что хотите начать игру заново?</p>
      <div class="modal__buttons">
        <button class="modal__button button">Ок</button>
        <button class="modal__button button">Отмена</button>
      </div>
    </section>`;
    }

    _bind(element) {
      const [buttonOk, buttonCancel] = element.querySelectorAll(`.modal__button`);
      const buttonClose = element.querySelector(`.modal__close`);

      buttonOk.addEventListener(`click`, () => {
        this.onRestartGame();
      });

      buttonCancel.addEventListener(`click`, () => {
        this.onReturnToGame();
      });

      buttonClose.addEventListener(`click`, () => {
        this.onReturnToGame();
      });
    }

    onRestartGame() {}
    onReturnToGame() {}
  }

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

  class GameScreen extends AbstractScreen {
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

  function getResult(resultArray, result) {
    if (result.restTime === 0) {
      return {
        statistics: resultArray,
        type: RESULT_TYPE.FAIL,
        title: `Увы и ах!`,
        text: `Время вышло! Вы не успели отгадать все мелодии`
      };
    }
    if (result.lives === 0) {
      return {
        statistics: resultArray,
        type: RESULT_TYPE.FAIL,
        title: `Какая жалость!`,
        text: `У вас закончились все попытки. Ничего, повезёт в следующий раз!`
      };
    }

    const statistics = [...resultArray];
    const length = statistics.length;
    const index = statistics.findIndex((item) => item <= result.score);

    if (index < 0) {
      statistics.push(result.score);

      if (length === 0) {
        return {
          statistics,
          type: RESULT_TYPE.OK,
          title: `Вы настоящий меломан!`,
          text: `Вы заняли 1 место из 1 игроков. Это лучше, чем у 100% игроков`
        };
      }

      return {
        statistics,
        type: RESULT_TYPE.OK,
        title: `Вы настоящий меломан!`,
        text: `Вы заняли ${length + 1} место из ${length + 1} игроков. Это лучше, чем у 0% игроков`
      };
    }
    const place = index + 1;
    const percentage = Math.round((length - index) * 100 / (length + 1));
    let currentScore = result.score;
    for (let j = index; j < length; j++) {
      [statistics[j], currentScore] = [currentScore, statistics[j]];
    }
    statistics.push(currentScore);
    return {
      statistics,
      type: RESULT_TYPE.OK,
      title: `Вы настоящий меломан!`,
      text: `Вы заняли ${place} место из ${length + 1} игроков. Это лучше, чем у ${percentage}% игроков`
    };
  }

  function getPersonalResult(result) {
    const minutes = Math.floor((TOTAL_TIME - result.restTime) / 60);
    const seconds = (TOTAL_TIME - result.restTime) % 60;
    const mistakes = TOTAL_LIVES - result.lives;
    const minutesText = `${minutes} минут${formWordEnd(minutes, `у`, `ы`, ``)}`;
    const secondsText = `${seconds} секунд${formWordEnd(seconds, `у`, `ы`, ``)}`;
    const scoreText = `${result.score} балл${formWordEnd(result.score, ``, `а`, `ов`)}`;
    const mistakesText = `${mistakes} ошиб${formWordEnd(mistakes, `ку`, `ки`, `ок`)}`;
    if (minutes === 0) {
      return `За ${secondsText} вы набрали ${scoreText}, ${(mistakes === 0) ? `без ошибок` : `совершив ${mistakesText}`}`;
    } else if (seconds === 0) {
      return `За ${minutesText} вы набрали ${scoreText}, ${(mistakes === 0) ? `без ошибок` : `совершив ${mistakesText}`}`;
    } else {
      return `За ${minutesText} и ${secondsText} вы набрали ${scoreText}, ${(mistakes === 0) ? `без ошибок` : `совершив ${mistakesText}`}`;
    }
  }

  function formWordEnd(num, firstEnd, secondEnd, threeEnd) {
    let expression = (num % 10 < 5) ? secondEnd : threeEnd;
    expression = (num % 10 === 1) ? firstEnd : expression;
    return (num > 4 && num < 21) ? threeEnd : expression;
  }

  class ResultView extends AbstractView {
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

  class ResultScreen extends AbstractScreen {
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

  class Application {
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

  Application.showWelcome();

}());

//# sourceMappingURL=main.js.map
