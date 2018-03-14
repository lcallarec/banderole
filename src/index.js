// @flow
import type {Configuration, Context, Rules, Rule, Router} from './types';

import builtInRules from './built-in-rules';
import {createLocalRouter} from './router';

let context: Context = {
    rules: {},
};

let router: Router;

const rules: Rules = {...builtInRules};

const boot = (configuration: Configuration, bootContext: Context = {rules: {}}) => {
    context = {...bootContext};
    router = createLocalRouter(configuration);
};

const isEnabled = (feature: string) => {
    return router.isEnabled(context, rules, feature);
};

const addCustomRule = (customRuleName: string, customRule: Rule) => {
    rules[customRuleName] = customRule;
    context.rules = rules;
};

module.exports = {boot, isEnabled, addCustomRule};
