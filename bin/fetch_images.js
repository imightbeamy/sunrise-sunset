var moment = require('moment');
var Promise = require('bluebird');

var twitter = require('../src/twitter');
var db = require('../src/db');

var sun_queries = [
    "#sunrise -sunset",
    "#sunset -sunrise"
];

var sql = "insert into sun_images" +
          "(create_date, handle, tweet_img_url, tweet_id, tweet_text, tweet_created_at, tweet_location, image_type) " +
          "values($1, $2, $3, $4, $5, $6, $7, $8)";

function saveImage(search_results) {
    var tweet = search_results[0];
    return db.none(sql, [
        moment(),
        tweet.handle,
        tweet.img_url,
        tweet.tweet_id,
        tweet.tweet_text,
        tweet.tweet_created_at,
        tweet.tweet_location, 
        tweet.image_type,
    ]);
}

var promises = sun_queries.map(function(query) {
    return twitter.searchImages([
        query,
        "-RT -follow -free",
        "filter:images",
        "since:" + moment().format('YYYY-MM-DD'),
    ]).then(saveImage);
});

Promise.all(promises).then(function() {
    console.log("Compleated");
});