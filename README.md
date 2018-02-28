# Banderole

[![Build Status](https://travis-ci.org/lcallarec/banderole.svg?branch=master)](https://travis-ci.org/lcallarec/banderole)
[![codecov](https://codecov.io/gh/lcallarec/banderole/branch/master/graph/badge.svg)](https://codecov.io/gh/lcallarec/banderole)


> **Banderole** is a versatile Javascript feature-[flags / toggle / bits / flippers] library designed with simplicity in mind. There's no black magic inside !

## Usage

### Configure & boot banderole

```js
const banderole = require('banderole');

//From a file
const featureFlags = require('./your-own-feature-flags-definition-file.json');
/// Content of /your-own-feature-flags-definition-file.json :
///
/// {
///    "features": {
///        "switchboard": true,
///        "clock": false,
///        "send-slack-message-on-error": {
///            "enabled": false
///        }
///    }
/// }
///

//Or from a plain javascript object
const featureFlags = {
    "features": {
        "switchboard": false,
        "clock": true,
        "send-slack-message-on-error": {
            "enabled": false
        }
    }
};

banderole.boot(featureFlags);
```

Feature flags are described in a json configuration file, under a root `features` key.

## API

### `banderole.boot(flags: object, [context: object]): void`

- Boot the router. Optionally pass a [context object](#context-object) as second argument.

### `const isEnabled = banderole.isEnabled(featureName: string): boolean`

- Return whether the specified feature is _enabled_ or _disabled_. 

### `banderole.addCustomRule(ruleName: string, callback: Function<context, ...args>): void`

- Register a new rule with a custom lambda. You can define your own behavior and your own decision logic. Let's say you want to open a `send-slack-message-on-error` feature only on some runtime environment : 
```js
const currentEnv = process.env.NODE_ENV;
banderole.addCustomRule('env', (context, ...envs) => envs.includes(currentEnv));
```

Add this configurations options, where `env` is the previously created rule, and `["DEV", "STAGING"]` passed as arguments to `env` lambda.
```js
"features": {
    "send-slack-message-on-error": {
        "env": ["DEV", "STAGING"]  
    }
}
```

For more informations on writing your own custom rules : [Create your own custom rules](#create-your-own-custom-rules)


## Rules

**bandeole** is a toggle router which deals with two ways of describing your feature toggles :

## Flag definition

### Short expression syntax

Defined in feature configuration by using `<feature>:<flag>` pattern, as in `"switchboard": true` is the sample below. The flag value meant to be a boolean value, `true|false`. It is generally used as release toggles, mainly used for _separating a feature release from code deployment_.

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

**Rules syntax** are a more versatile way to decide whether the feature is _enabled_ or _disabled_. They can be [built-in](#built-in-rules) or [user-defined](#create-your-own-custom-rules) to fit your own logic.

Take care that the toggle router only supports one rule per feature ; if you need more control, read the `strategy:*` built-in rules or create your own !

### Built-in rules

#### `enabled : true|false`
- whether the feature is enabled or not ; it exists only for learning purpose : [Short expression syntax](#short-expression-syntax) is far more expressive.

#### `strategy:affirmative`
- take as argument an hash of rules which will be evaluated one by one. 
With this strategy, a feature is considered as _enabled_ as soon as at least one rule returns `true`.
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

In this exemple, the `shopping-cart-v2` feature will be _enabled_ if the application is running in `DEV` or `QA` environment **OR** between `8AM and 10PM`.

#### `strategy:unanimous`
- Similar to `strategy:affirmative` rule. Take as argument an hash of rules which will be evaluated one by one. 
But unlike `strategy:affirmative` rule, the feature will be considered as _enabled_ if **all** rules are evaluated to `true`.
```js
{
    "features": {
        "shopping-cart-v2": {
            "strategy:unanimous": {
                "env": ["DEV", "QA"],
                "between-hours": ["08", "22"]
            }
        },

    },
}
```

In this exemple, the `shopping-cart-v2` feature will be _enabled_ if the application is running in `DEV` or `QA` environment **AND** between `8AM and 10PM`.


### Create your own custom rules 

> It's easy for **banderole** to fit your stack and your needs.

Just write and register your own rules !

#### By the exemple: the runing env

Let's say we need to enable or disable a given dazzleling feature according to the running environment, i.e. `PROD`, `STAGING`, `DEV`, `QA`...

To achieve that, you'll first register a feature called `new-dazzle-feature`, an `env` rule, taking an array of arguments : `"DEV"` and `"QA"`.

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
banderole.addCustomRule('new-dazzle-feature', (context, ...envs) => envs.includes(currentEnv));

banderole.isEnabled('new-dazzle-feature'); //Will return true if currentEnv is DEV or QA envs, else it will return false
```

#### By the exemple: enable a feature between 8AM and 10PM.

```js
const flags = {
    "features": {
        "light-theme": {
            "between-hours": ["08", "22"]
        },
    },
};

banderole.boot(flags);
banderole.addCustomRule('between-hours', (context, startHour, endHour) => {
    const now = new Date();
    const hour = now.getHours();

    if (hour > startHour && hour < endHour) return true;
    return false;
};

//Between 08AM and 22PM
banderole.isEnabled('light-theme'); // true

//Between 22PM and 08AM
banderole.isEnabled('light-theme'); // false
```

## Context object

 The context object is nothing more that an user-defined databag. As it is passed as first argument of all rules, your custom rules can read them. It has two goals :
 - it helps keeping configuration things outside your custom rules logic
 - it helps keeping the feature-flags system unaware of your application logic

A common use case would be to save the current runtime-environment inside context object and read that value fom a custom-rule : 

```js
    const context = {
        env: process.env.RUNTIME_ENVIRONMENT || process.env.NODE_ENV, 
    };

    const flags = {
        features: {
            "debbug-logger": {
                "runtime-env": ["DEV"],
            }
        }
    };

    banderole.boot(flags, context);
    banderole.addCustomRule('runtime-env', (context, env) => {
        return context.env === env;
    });
```

You can pass anykind of data inside the context object, it's yours, feel free to also add some useful functions !


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