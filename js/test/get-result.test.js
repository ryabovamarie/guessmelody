import getResult from "../get-result";
const assert = require(`assert`);

describe(`result string validator`, () => {
  it(`should return that time is up`, () => {
    assert.equal(getResult([], {score: 5, lives: 3, restTime: 0}).text,
        `Время вышло! Вы не успели отгадать все мелодии`);
  });
  it(`should return that lives is up`, () => {
    assert.equal(getResult([], {score: 5, lives: 0, restTime: 40}).text,
        `У вас закончились все попытки. Ничего, повезёт в следующий раз!`);
  });
  it(`should return valid length array`, () => {
    assert.equal(getResult([], {score: 10, lives: 3, restTime: 40}).statistics.length, 1);
  });
  it(`should return sorted array`, () => {
    const resultArray = getResult([11, 8, 5, 4], {score: 10, lives: 3, restTime: 40}).statistics;
    assert.equal(resultArray.length, 5);
    for (let i = 1; i < resultArray.length; i++) {
      assert.ok(resultArray[i - 1] >= resultArray[i]);
    }
  });
  it(`should return correct line`, () => {
    assert.equal(getResult([11, 8, 5, 4], {score: 10, lives: 3, restTime: 40}).text,
        `Вы заняли 2 место из 5 игроков. Это лучше, чем у 60% игроков`);
  });
  it(`should return correct line when statistics is empty`, () => {
    assert.equal(getResult([], {score: 10, lives: 3, restTime: 40}).text,
        `Вы заняли 1 место из 1 игроков. Это лучше, чем у 100% игроков`);
  });
  it(`should return correct line when result is worst`, () => {
    assert.equal(getResult([11, 8, 5, 4], {score: 3, lives: 3, restTime: 40}).text,
        `Вы заняли 5 место из 5 игроков. Это лучше, чем у 0% игроков`);
  });
});
