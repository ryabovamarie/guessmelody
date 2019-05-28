import getPersonalResult from "../get-personal-result";
const assert = require(`assert`);

describe(`personal result string validator`, () => {
  it(`should be correct with 1 minute 1 second 1 score 1 mistake`, () => {
    assert.equal(getPersonalResult({score: 1, lives: 2, restTime: 239}),
        `За 1 минуту и 1 секунду вы набрали 1 балл, совершив 1 ошибку`);
  });

  it(`should be correct with 2 minute 3 second 4 score 2 mistake`, () => {
    assert.equal(getPersonalResult({score: 4, lives: 1, restTime: 177}),
        `За 2 минуты и 3 секунды вы набрали 4 балла, совершив 2 ошибки`);
  });

  it(`should be correct with 3 minute 11 score 2 mistake`, () => {
    assert.equal(getPersonalResult({score: 11, lives: 1, restTime: 120}),
        `За 3 минуты вы набрали 11 баллов, совершив 2 ошибки`);
  });

  it(`should be correct with 54 second 15 score 0 mistake`, () => {
    assert.equal(getPersonalResult({score: 15, lives: 3, restTime: 246}),
        `За 54 секунды вы набрали 15 баллов, без ошибок`);
  });
});
