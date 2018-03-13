// @flow
import type {Configuration, Context, Rules, Rule} from './types';

import builtInRules from './built-in-rules';

let context: Context = {
    rules: {},
};

let featureFlags: Configuration = {
    features: {},
};

const rules: Rules = {...builtInRules};

const boot = (features: Configuration, bootContext: Context = {rules: {}}) => {
    context = {...bootContext};
    featureFlags.features = {...features.features};
};

const isEnabled = (feature: string) => {
    const flag = featureFlags['features'][feature];

    if (typeof flag === 'boolean') {
        return flag;
    }

    if (typeof flag === 'object' && flag != null) {
        const rule = Object.keys(flag)[0];
        const ruleFn = rules[rule];

        if (rules[rule]) {
            if (Array.isArray(flag[rule])) {
                return ruleFn(context, ...flag[rule]);
            } else {
                return ruleFn(context, flag[rule]);
            }
        }
    }

    return false;
};

const addCustomRule = (customRuleName: string, customRule: Rule) => {
    rules[customRuleName] = customRule;
    context.rules = rules;
};

module.exports = {boot, isEnabled, addCustomRule};
