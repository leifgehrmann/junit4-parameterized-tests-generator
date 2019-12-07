test('Test exception is thrown on nonExistentDirectory', () => {
  expect.assertions(1);

  // Fake the second argument being passed in as a command line argument.
  process.argv = [null, null, 'tests/testCases/nonExistentDirectory'];

  try {
    // eslint-disable-next-line global-require
    require('./../generateParameterizedTests.js');
  } catch (e) {
    expect(e.message).toMatch('');
  }
});
