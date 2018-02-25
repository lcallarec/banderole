const banderole = require('../index');
const testData = require('./feature-flags.json');

beforeEach(() => {
    banderole.boot(testData);
    banderole.addCustomRule('authorize', () => true);
    banderole.addCustomRule('unauthorize', () => false);
});

describe('A feature-flag can be defined by an object containing an enabled key', () => {
    test('A feature-flag with an enabled key set to true should be enabled', () => {
        expect(banderole.isEnabled('mailer')).toBeTruthy();
    });

    test('A feature-flag with an enabled key set to true should be enabled', () => {
        expect(banderole.isEnabled('slack-integration')).toBeFalsy();
    });
});

describe('Feature-flag affirmative strategy rules are evaluated', () => {
    test('If at least one rule return true, the feature is enabled', () => {
        expect(banderole.isEnabled('affirmative-strategy-with-one-enable-vote')).toBeTruthy();
    });
    test('If no rules return true, the feature is disabled', () => {
        expect(banderole.isEnabled('affirmative-strategy-with-no-enable-vote')).toBeFalsy();
    });
});
