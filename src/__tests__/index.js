const banderole = require('../index');
const testData = require('./feature-flags.json');

beforeEach(() => {
    banderole.boot(testData);
});

describe('A feature-flag can be defined by a boolean value', () => {
  test('A feature-flag explicitely set to true should be enabled', () => {
    expect(banderole.isEnabled('switchboard')).toBeTruthy();
  });

  test('A feature-flag explicitely set to false should be disabled', () => {
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

test('The internal feature-flags object should not be muted is the original is mutated ', () => {
    
    //Given
    let featureFlags = {features: {}};
    banderole.boot(featureFlags);

    //When
    featureFlags["features"]["i_shouldnt_be_there"] = true;

    //Then
    expect(banderole.isEnabled('i_shouldnt_be_there')).toBeFalsy();
});

