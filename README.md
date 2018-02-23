# banderole

Banderole is a versatile Javascript feature-flag/toggle library designed with simplicity in mind.

## How to use

Feature flags are described in a json configuration file, under a root `feature` key :

```json
{
    "features": {
        "switchboard": ...,
        "clock": ...,
        "slack-integration": {
            "enabled": false
        }
    }
}
```

```js
const banderole = require('banderole');

//From a file
const featureFlags = require('./your-own-feature-flags-definition-file.json');

//Or from a plain javascript object
const featureFlags = {
    features: {
        switchboard: false,
        clock: true,
        slack-integration: {
            enabled: false
        }
    }
};

banderole.boot(featureFlags);

banderole.isEnabled('switchboard'); // false

```
## Flags definition

### As boolean value

```js
const flags = {
    features: {
        switchboard: true,
        clock: false,
    }
}

banderole.boot(flags);

banderole.isEnabled('switchboard'); // true
banderole.isEnabled('clock');       // false

```

### As an object containing an "enabled" rules
```js
{
    features: {
        mailer: {
            enabled: true,
        },
        slack-integration: {
            enabled: false,
        },
    },
}

banderole.boot(flags);

banderole.isEnabled('mailer'); // true
banderole.isEnabled('slack-integration');       
```

### Requesting a non-existing flag

Whenever you try to request an non-existing flag, it'll be considered as disabled.

```js
const flags = {
    features: {
        switchboard: true,
    }
}

banderole.boot(flags);

banderole.isEnabled('api-v2'); // false
```


