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
    "features": {
        "switchboard": false,
        "clock": true,
        "slack-integration": {
            "enabled": false
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
    "features": {
        "switchboard": true,
        "clock": false,
    }
};

banderole.boot(flags);

banderole.isEnabled('switchboard'); // true
banderole.isEnabled('clock');       // false

```

### As an object containing an "enabled" rules
```js
const flags = {
    "features": {
        "mailer": {
            enabled: true,
        },
        "slack-integration": {
            "enabled": false,
        },
    },
};

banderole.boot(flags);

banderole.isEnabled('mailer'); // true
banderole.isEnabled('slack-integration');       
```

### As a custom rules

The `enabled` rule seen before is - internally - a simple lambda function, _i.e._: `(value) => value`.

You can register your own rules. 

One very common use case would be to enable a feature according the the current running environement, like `PROD`, `STAGING`, `DEV`, `QA`...

To achieve that, you'll write something like :
```js
const flags = {
    "features": {
        "new-dazzle-feature": {
            "env": ["DEV", "QA"]
        },
    },
};
banderole.boot(flags);

const currentEnv = process.env.NODE_ENV;
banderole.addRule('new-dazzle-feature', (...envs) => envs.includes(currentEnv));

banderole.isEnabled('new-dazzle-feature'); //Will return true on DEV and QA envs
```

Outside this common use case, what about enabling a feature only during the day ?
```js
const flags = {
    "features": {
        "light-theme": {
            "between-hours": ["08", "22"]
        },
    },
};

banderole.boot(flags);
banderole.addRule('is-current-time-between', (startHour, endHour) => {
    const now = new Date();
    const hour = now.getHours();

    if (hour > startHour && hour < endHour) return true;
    return false;
};

//During 08AM and 22PM
banderole.isEnabled('light-theme'); // true

//During 22PM and 08AM
banderole.isEnabled('light-theme'); // false
```

### Requesting a non-existing flag

Whenever you try to request an non-existing flag, it'll be considered as disabled.

```js
const flags = {
    "features": {
        "switchboard": true,
    }
}

banderole.boot(flags);

banderole.isEnabled('api-v2'); // false
```


