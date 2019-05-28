import getScore from '../get-score';
const assert = require(`assert`);

const allOk = [...Array(10)].map(() => ({isOk: true, time: 40}));
const allOkFast = allOk.map(() => ({isOk: true, time: 25}));
const failed = allOk.map(() => ({isOk: false, time: 40}));
const oneFail = allOk.map((item) => Object.assign({}, item));
oneFail[5].isOk = false;
const twoFails = oneFail.map((item) => Object.assign({}, item));
for (let i = 0; i < 5; i++) {
  twoFails[i].time = 20;
}
twoFails[8].isOk = false;

describe(`score validator`, () => {
  it(`should return -1`, () => {
    assert.equal(getScore(allOk.slice(2), 3), -1);
    assert.equal(getScore(failed, 0), -1);
  });
  it(`should be correct when 2 lives left`, () => {
    assert.equal(getScore(oneFail, 2), 7);
  });
  it(`should be correct when 1 lives left`, () => {
    assert.equal(getScore(twoFails, 1), 9);
  });
  it(`should return 10`, () => {
    assert.equal(getScore(allOk, 3), 10);
  });
  it(`should return 20`, () => {
    assert.equal(getScore(allOkFast, 3), 20);
  });
});
