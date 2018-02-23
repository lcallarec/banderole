const banderole = require('../index');

const featureFlags = require('./feature-flags.json');

banderole.boot(featureFlags);

describe('A feature-flag can be defined by a boolean value', () => {
  test('A feature-flag explicitely set to false should be disabled', () => {
    expect(banderole.isEnabled('switchboard')).toBeTruthy();
  });

  test('A feature-flag explicitely set to true should be enabled', () => {
    expect(banderole.isEnabled('clock')).toBeFalsy();
  });
});

test('A feature-flag which not exists should be disabled', () => {
  expect(banderole.isEnabled('I-don-t-exists')).toBeFalsy();
});

describe('A feature-flag can be defined by an object containing an enabled key', () => {
    test('A feature-flag with an enabled key set to true should be enabled', () => {
        expect(banderole.isEnabled('mailer')).toBeTruthy();
    });

    test('A feature-flag with an enabled key set to true should be enabled', () => {
        expect(banderole.isEnabled('slack-integration')).toBeFalsy();
    });
});
