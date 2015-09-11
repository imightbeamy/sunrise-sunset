var express = require('express');
var Promise = require('bluebird');
var moment = require('moment');

var twitter = require('./src/twitter');
var view = require('./src/view');
var db = require('./src/db');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('mustache', require('hogan-express'));
app.set('view engine', 'mustache');

var sql =
    "select * from sun_images where image_type=$1 and create_date >= $2 order by create_date asc"

app.get('/', function(req, res) {

    var yesterday = moment().subtract(24, 'hours');

    var promises = [
        db.pg.many(sql, [ "sunrise", yesterday ]),
        db.pg.many(sql, [ "sunset", yesterday ]),
    ];

    Promise.all(promises)
        .then(function(tweet_sets) {
            res.render('index', view.indexData(tweet_sets));
        })
        .catch(function(err) {
            console.error(err, JSON.stringify(err));
        });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
