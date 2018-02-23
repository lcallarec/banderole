
let featureFlags = {
  features: {}
}

const boot = (features) => {
  featureFlags = features
}

const isEnabled = (feature) => {
  const flag = featureFlags['features'][feature]

  if (typeof flag === 'boolean') {
    return flag
  }

  return false
}

module.exports = { boot, isEnabled }
