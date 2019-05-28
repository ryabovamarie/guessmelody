export default class AbstractView {
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
