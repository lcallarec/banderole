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
    'strategy:unanimous': (rules, allRouterRules) => {
        for (let rule in rules) {
            if (allRouterRules[rule](rules[rule]) === false) {
                return false;
            }
        }
        return true;
    },
 };

module.exports = rules;
