const { addNumbers } = require('./../src/utils.js');

test('addition', () => {
  expect(addNumbers(2, 3)).toBe(5);
});
