const banderole = require('../index');

const featureFlags = require('./feature-flags.json');

banderole.boot(featureFlags);

describe('A feature-flag can be defined by a boolean value', () => {
  test('A feature-flag explicitely set to false must be disabled', () => {
    expect(banderole.isEnabled('switchboard')).toBeTruthy();
  });

  test('A feature-flag explicitely set to true must be enabled', () => {
    expect(banderole.isEnabled('clock')).toBeFalsy();
  });
});

test('A feature-flag which not exists is considered as disabled', () => {
  expect(banderole.isEnabled('I-don-t-exists')).toBeFalsy();
});
