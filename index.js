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

app.get('/', function(req, res) {

    db.many("select * from sun_images order by create_date desc limit 2")
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
