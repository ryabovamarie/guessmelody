export default function trackPlay(trackElement, playing) {
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
