import AbstractView from './abstract-view';

export default class ConfirmView extends AbstractView {
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
