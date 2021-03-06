// @flow

const banderole = require('../index');
const testData = require('./feature-flags.json');

beforeEach(() => {
    const context = {
        rules: {},
        env: 'DEV',
    };

    banderole.boot(testData, context);
    banderole.addCustomRule('is-greater-than-10', (context, value): boolean => {
        if (!isNaN(+value) && isFinite(value)) {
            return ((value: any): number) > 10;
        }

        return false;
    });

    banderole.addCustomRule('runtime-env', (context, env): boolean => {
        return context.env === env;
    });
});

describe('With a banderole router booted', () => {
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

    test('The internal feature-flags object should not be mutated is the original is mutated', () => {
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

    describe('A context can be added at boot time', () => {
        test('A context is readable from the rule', () => {
            expect(banderole.isEnabled('debug-logger')).toBeTruthy();
        });
    });
});
