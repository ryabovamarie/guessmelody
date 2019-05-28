import {TOTAL_QUESTIONS} from './consts';

export default function getScore(answers, lives) {
  if (answers.length < TOTAL_QUESTIONS || lives === 0) {
    return -1;
  }
  return answers.reduce((score, item) => {
    const timeScore = item.time < 30 ? 2 : 1;
    return score + (item.isOk ? timeScore : -2);
  }, 0);
}
