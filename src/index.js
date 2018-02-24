
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
        if (rules[rule]) {
            return rules[rule](flag[rule]);
        }
    }

    return false;
};

const addRule = (ruleName, rule) => {
    rules[ruleName] = rule;
};

const rules = {
    enabled: (value) => value,
};

module.exports = {boot, isEnabled, addRule};
