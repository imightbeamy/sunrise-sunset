var moment = require('moment');
var Promise = require('bluebird');

var twitter = require('../src/twitter');
var db = require('../src/db');

var sql = "insert into sun_images" +
          "(create_date, handle, tweet_img_url, tweet_id, tweet_text, tweet_created_at, tweet_location, image_type) " +
          "values($1, $2, $3, $4, $5, $6, $7, $8)";

function saveImage(search_results, image_type) {
    var tweet = search_results[0];
    return db.pg.none(sql, [
        moment(),
        tweet.handle,
        tweet.img_url,
        tweet.tweet_id,
        tweet.tweet_text,
        tweet.tweet_created_at,
        tweet.tweet_location, 
        image_type,
    ]);
}

function search(query, image_type) {
    return twitter.searchImages([
        query,
        "-RT -follow -free",
        "filter:images",
        "since:" + moment().format('YYYY-MM-DD'),
    ]).then(function(search_results) {
        return saveImage(search_results, image_type)
    });
}

var promises = [
    search("#sunrise -sunset", "sunrise"),
    search("#sunset -sunrise", "sunset")
];

Promise.all(promises).then(function() {
    console.log("Compleated");
    db.pg_end();
});