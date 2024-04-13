const formatDate = require('../utils/formatDate');

const helpers = {
    json: function (context) {
        return JSON.stringify(context);
    },
    sum: (a, b) => a + b,
    formatDate: (dateString) => formatDate(dateString),
    ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
};

module.exports = helpers;
