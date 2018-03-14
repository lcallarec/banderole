// @flow

import type {Context, Configuration, Features, Rules, Router} from './types';

const decider = (context: Context, rules: Rules, features: Features, feature: string): boolean => {
    const flag = features[feature];
    if (typeof flag === 'boolean') {
        return flag;
    }

    if (typeof flag === 'object' && flag != null) {
        const rule = Object.keys(flag)[0];
        const ruleFn = rules[rule];

        if (rules[rule]) {
            if (Array.isArray(flag[rule])) {
                return ruleFn(context, ...flag[rule]);
            } else {
                return ruleFn(context, flag[rule]);
            }
        }
    }

    return false;
};

export const createLocalRouter = (configuration: Configuration): Router => {
    const features = {...configuration.features};
    return {
        type: 'LOCAL',
        isEnabled: (context: Context, rules: Rules, feature: string): boolean => {
            return decider(context, rules, features, feature);
        },
    };
};
