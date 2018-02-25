const rules = {
    'enabled': (value) => {
        return value;
    },
    'strategy:affirmative': (rules, allRouterRules) => {
        for (let rule in rules) {
            if (allRouterRules[rule](rules[rule]) === true) {
                return true;
            }
        }
        return false;
    },
 };

module.exports = rules;
