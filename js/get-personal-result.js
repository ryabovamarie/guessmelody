import {TOTAL_TIME, TOTAL_LIVES} from './consts';

export default function getPersonalResult(result) {
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
