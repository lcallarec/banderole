// @flow
import type {Context, Features, Rule} from './types';

const rules = {
    'enabled': (context: Context, value: boolean) => {
        return value;
    },
    'strategy:affirmative': (context: Context, rules: Features) => {
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
    'strategy:unanimous': (context: Context, rules: Features) => {
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
