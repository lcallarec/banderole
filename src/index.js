
let featureFlags = {
  features: {},
};

const boot = (features) => {
  featureFlags = features;
};

const isEnabled = (feature) => {
  const flag = featureFlags['features'][feature];

  if (typeof flag === 'boolean') {
    return flag;
  }

  if (typeof flag === 'object' && flag.hasOwnProperty("enabled")) {
      return flag.enabled;
  }

  return false;
};

module.exports = {boot, isEnabled};
