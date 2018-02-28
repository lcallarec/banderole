const rules = {
    'enabled': (context, value) => {
        return value;
    },
    'strategy:affirmative': (context, rules) => {
        for (let rule in rules) {
            if (context.rules[rule](rules[rule]) === true) {
                return true;
            }
        }
        return false;
    },
    'strategy:unanimous': (context, rules) => {
        for (let rule in rules) {
            if (context.rules[rule](rules[rule]) === false) {
                return false;
            }
        }
        return true;
    },
 };

module.exports = rules;
