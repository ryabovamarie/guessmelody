export default class AbstractScreen {
  constructor() {}

  get element() {
    return this.view.element;
  }
}
