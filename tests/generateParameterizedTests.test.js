const dircompare = require('dir-compare');
const copy = require('recursive-copy');

test('Test Cases all handled correctly', async () => {
  const original = 'tests/testCases/original';
  const actual = 'tests/testCases/actual';
  const expected = 'tests/testCases/expected';

  // Copy files from "original" to "actual"
  await copy(original, actual, { overwrite: true });

  // Fake the second argument being passed in as a command line argument.
  process.argv = [null, null, actual];

  // eslint-disable-next-line global-require
  require('../generateParameterizedTests.js');

  const result = dircompare.compareSync(expected, actual, { compareContent: true });
  expect(result.same).toBe(true);
});
