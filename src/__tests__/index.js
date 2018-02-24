const banderole = require('../index');
const clock = require('../clock');
const testData = require('./feature-flags.json');

beforeEach(() => {
    banderole.boot(testData);

    banderole.addRule('is-greater-than-10', (value) => {
        return value > 10;
    });
});

describe('A feature-flag can be defined by a boolean value', () => {
    test('A feature-flag explicitely set to true should be enabled', () => {
        expect(banderole.isEnabled('switchboard')).toBeTruthy();
    });

    test('A feature-flag explicitely set to false should be disabled', () => {
        expect(banderole.isEnabled('clock')).toBeFalsy();
    });
});

test('A feature-flag which not exists should be considered as disabled', () => {
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

test('The internal feature-flags object should not be mutated is the original is mutated ', () => {
    // Given
    let featureFlags = {features: {}};
    banderole.boot(featureFlags);

    // When
    featureFlags['features']['i_shouldnt_be_there'] = true;

    // Then
    expect(banderole.isEnabled('i_shouldnt_be_there')).toBeFalsy();
});

describe('Rules can be added and evaluated at runtime', () => {
    test('Rules have arguments given by feature-flag rule value', () => {
        expect(banderole.isEnabled('service-panel')).toBeTruthy();
        expect(banderole.isEnabled('red-fonts')).toBeFalsy();
    });
});

describe('Feature-flag affirmative strategy rules are evaluated', () => {
    test('If at least one rule return true, the feature-flag is enabled', () => {
        expect(banderole.isEnabled('affirmative-strategy-with-one-enable-vote')).toBeTruthy();
    });
    test('If no rules return true, the feature-flag is disabled', () => {
        expect(banderole.isEnabled('affirmative-strategy-with-no-enable-vote')).toBeFalsy();
    });
});

