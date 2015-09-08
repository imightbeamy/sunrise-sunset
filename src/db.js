var Promise = require('bluebird');
var pgp = require('pg-promise')({
    promiseLib: Promise
});

module.exports = {
    pg: pgp(process.env.DATABASE_URL + "?ssl=true"),
    pg_end: pgp.end
};