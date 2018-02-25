# Banderole

> **Banderole** is a versatile Javascript feature-flag/toggle library designed with simplicity in mind. There's no black magic inside !

## Configure your feature flags

Feature flags are described in a json configuration file, under a root `features` key :

```json
{
    "features": {
        "switchboard": true,
        "clock": false,
        "slack-integration": {
            "enabled": false
        }
    }
}
```

## Rules

**bandeole** core-engine deals with two ways of describing your feature toggles :

1. **Short expression syntax** : use `<feature>:<flag>` pattern, like in `"switchboard": true`. The `<feature>` stand for the feature we need to flag. A flag is basically a boolean value, _true_ or _false_, which means the feature is _enabled_ or _disabled_. 

2. **Rules syntax**: rules are a more versatile way to decide weither the feature is _enabled_ or _disabled_. Rules can be [built-in](#built-in-rules) or [user-defined](#create-your-own-custom-rules).

## Usage

### Boot banderole

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
```

Your can now request **banderole** to check weither the feature is _enabled_ or _disabeld_.

```js
banderole.isEnabled('switchboard'); // false
```

## Flag definition

### Short expression syntax

Just associate a feature name with a `<bool>` value, `true|false`, to decide if the feature is _enabled_ or _disabeld_.

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

### Rules syntax
```js
const flags = {
    "features": {
        "mailer": {
            "enabled": true,
        },
        "slack-integration": {
            "enabled": false,
        },
    },
};

banderole.boot(flags);

banderole.isEnabled('mailer'); // true
banderole.isEnabled('slack-integration'); // false
```

There's no black magic here, `enabled` has no magical meaning, it's basically a rule named `enabled` associated with a lambda which return the enabled value:  `'enabled': (value) => value`. It's part of the build-in rules, but you can also register your own rules or override built-ins ones. No magic.

Take care that the core-engine only supports one rule per feature ; if you need more control, read the strategy:* built-in rules or create your own !

### Built-in rules

* enabled : `boolean` : `true|false`, weither the feature is enabled or not

* strategy:affirmative: take an object as value. Each property of this object must match an existing rule name. Property values are arguments that are passed back to the rule.
With this strategy, a feature is considered as _enbaled_ as soon as one rule returns `true`.  
```js
{
    "features": {
        "shopping-cart-v2": {
            "strategy:affirmative": {
                "env": ["DEV", "QA"],
                "between-hours": ["08", "22"]
            }
        },

    },
}
```

In this exemple, the `shopping-cart-v2` feature will be _enabled_ if the application is running in `DEV` or `QA` environement or between `8AM and 10PM`.


### Create your own custom rules 

> It's easy for **banderole** to fit your stack, your needs.

Just write and register your own rules !

#### By the exemple: the runing env

Let's say we need to enable or disable a given dazzleling feature according to the running environment, i.e. `PROD`, `STAGING`, `DEV`, `QA`...

To achieve that, you'll first register your feature `new-dazzle-feature`, which will invoke, when requested, an `env` rule, taking an array of arguments : `"DEV"` and `"QA"`.

```js
const flags = {
    "features": {
        "new-dazzle-feature": {
            "env": ["DEV", "QA"]
        },
    },
};
banderole.boot(flags);
```

As it's likely there's no common way to check the runing environment, you'll need to write your own `env` rule.  

```js
const currentEnv = process.env.NODE_ENV;
banderole.addRule('new-dazzle-feature', (...envs) => envs.includes(currentEnv));

banderole.isEnabled('new-dazzle-feature'); //Will return true if currentEnv is DEV or QA envs, else it will return false
```

#### By the exemple: enable a feature between 8h and 10h.

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

//During 08h and 22h
banderole.isEnabled('light-theme'); // true

//During 22h and 08h
banderole.isEnabled('light-theme'); // false
```

## Requesting a non-existing flag

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


