export default function trackPlay(trackElement, playing) {
  const trackButton = trackElement.querySelector(`.track__button`);
  const trackAudio = trackElement.querySelector(`audio`);
  trackButton.addEventListener(`click`, () => {
    if (!playing.isOk && trackButton.classList.contains(`track__button--play`)) {
      trackButton.classList.remove(`track__button--play`);
      trackButton.classList.add(`track__button--pause`);
      trackAudio.play();
      playing.isOk = true;
    } else if (trackButton.classList.contains(`track__button--pause`)) {
      trackButton.classList.remove(`track__button--pause`);
      trackButton.classList.add(`track__button--play`);
      trackAudio.pause();
      playing.isOk = false;
    }
  });
}
