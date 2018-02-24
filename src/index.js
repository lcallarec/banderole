
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
      return flag.enabled;
  }

  return false;
};

module.exports = {boot, isEnabled};