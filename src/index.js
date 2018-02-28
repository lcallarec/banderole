const builtInRules = require('./built-in-rules');

let context = '{}';

let featureFlags = {
    features: {},
};

const rules = {...builtInRules};

const boot = (features, bootContext) => {
    context = {...bootContext};
    featureFlags.features = {...features.features};
};

const isEnabled = (feature) => {
    const flag = featureFlags['features'][feature];

    if (typeof flag === 'boolean') {
        return flag;
    }

    if (typeof flag === 'object') {
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

const addCustomRule = (customRuleName, customRule) => {
    rules[customRuleName] = customRule;
    context.rules = rules;
};

module.exports = {boot, isEnabled, addCustomRule};
