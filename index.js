var express = require('express');
var Promise = require('bluebird');

var twitter = require('./src/twitter');
var view = require('./src/view');
var db = require('./src/db');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('mustache', require('hogan-express'));
app.set('view engine', 'mustache');

var sql = "select * from sun_images where image_type=$1 order by create_date desc limit 1"

app.get('/', function(req, res) {

    var promises = [
        db.pg.one(sql, "sunrise"),
        db.pg.one(sql, "sunset"),
    ];

    Promise.all(promises)
    .then(function(tweets) {
        res.render('index', view.indexData(tweets));
    })
    .catch(function(err) {
        console.error(err, JSON.stringify(err));
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
