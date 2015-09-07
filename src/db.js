var Promise = require('bluebird');
var pgp = require('pg-promise')({
    promiseLib: Promise
});

module.exports = pgp(process.env.DATABASE_URL + "?ssl=true");