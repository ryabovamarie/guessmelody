import {RESULT_TYPE} from './consts';

export default function getResult(resultArray, result) {
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
