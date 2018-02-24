
let featureFlags = {
    features: {},
};

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
                return ruleFn(...flag[rule]);
            } else {
                return ruleFn(flag[rule]);
            }
        }
    }

    return false;
};

const addRule = (ruleName, rule) => {
    rules[ruleName] = rule;
};

const rules = {
    'enabled': (value) => value,
    'strategy:affirmative': (rules) => {
        if (Array.isArray(rules)) {
            return rules.some((rule) => rules[rule]());
        }
        return false;
    }
};

module.exports = {boot, isEnabled, addRule};
