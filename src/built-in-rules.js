// @flow
import type {Context, Feature, Rule} from './types';

const rules = {
    'enabled': (context: Context, value: boolean) => {
        return value;
    },
    'strategy:affirmative': (context: Context, rules: Feature) => {
        for (let rule: string in rules) {
            if (context.rules[rule]) {
                const fn: Rule = context.rules[rule];
                const args: mixed = rules[rule];
                if (fn(context, args) === true) {
                    return true;
                }
            }
        }
        return false;
    },
    'strategy:unanimous': (context: Context, rules: Feature) => {
        for (let rule: string in rules) {
            if (context.rules[rule]) {
                const fn: Rule = context.rules[rule];
                const args: mixed = rules[rule];
                if (fn(context, args) === false) {
                    return false;
                }
            }
        }
        return true;
    },
 };

module.exports = rules;
