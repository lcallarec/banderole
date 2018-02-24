
let featureFlags = {
  features: {},
};

let context = {};

const boot = (features) => {
  featureFlags.features = {...features.features};
};

const isEnabled = (feature) => {

  const flag = featureFlags['features'][feature];

  if (typeof flag === 'boolean') {
    return flag;
  }

  if (typeof flag === 'object' && flag.hasOwnProperty('enabled')) {
      return rules.enabled(context, flag.enabled);
  }

  return false;
};

const rules = {
    enabled: (context, value) => value,
}

module.exports = {boot, isEnabled};