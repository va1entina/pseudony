const helpers = require('../helpers');

describe('calculateAge', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2023, 6, 21));
  });
  
  afterAll(() => {
      jest.useRealTimers();
  });

  test('returns correct age when correct input', () => {
    expect(helpers.calculateAge("1993-03-12")).toBe(30);
  });

  test('returns null when empty input', () => {
    expect(helpers.calculateAge("")).toBe(null);
  });

  test('returns null when date of birth in the future', () => {
    expect(helpers.calculateAge("2024-11-23")).toBe(null);
  });
});