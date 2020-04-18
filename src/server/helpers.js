const helpers = {};
const moment = require('moment');

helpers.timeAgo = timestamp => {
    return moment(timestamp).startOf('minute').fromNow();
};

module.exports = helpers;