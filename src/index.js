const builtInRules = require('./built-in-rules');

let featureFlags = {
    features: {},
};

const rules = {...builtInRules};

const boot = (features) => {
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
                return ruleFn(...flag[rule], rules);
            } else {
                return ruleFn(flag[rule], rules);
            }
        }
    }

    return false;
};

const addCustomRule = (customrRuleName, customRule) => {
    rules[customrRuleName] = customRule;
};

module.exports = {boot, isEnabled, addCustomRule};
