export default function changeView(element) {
  const main = document.querySelector(`.main`);
  main.innerHTML = ``;
  main.appendChild(element);
}
