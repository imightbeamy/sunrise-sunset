var moment = require('moment');
var Promise = require('bluebird');
var _ = require('underscore');
var schedule = require('node-schedule');

var twitter = require('../src/twitter');
var db = require('../src/db');
var alchemy = require('../src/alchemy');

var VALID_TAGS = [
    "sky", "sunset", "sun", "sunrise",
    "cloud", "water", "reflection", "beach", "sea" ];
var INVALID_TAGS = [
    "moon"
];

var sql = "insert into sun_images" +
          "(create_date, handle, tweet_img_url, tweet_id, tweet_text, tweet_created_at, tweet_location, image_type) " +
          "values($1, $2, $3, $4, $5, $6, $7, $8)";

function saveImage(tweet, image_type) {
    console.log("Saving image", tweet);
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
    ], 10).then(function(tweets) {
        return checkTags(tweets, image_type, 0);
    });
}

function checkTags(tweets, image_type, i) {
    var tweet = tweets[i];
    return alchemy.getImageTags(tweet.img_url).then(function(tags) {

        var image_tags = _.pluck(tags, "text"),
            has_valid_tags = _.intersection(image_tags, VALID_TAGS).length,
            has_invalid_tags = _.intersection(image_tags, INVALID_TAGS).length;

        console.log("Got tags for image", tweet.img_url, image_tags);

        var try_number = i + 1;
        if (has_valid_tags && !has_invalid_tags) {
            // This is prob a sun, use it!
            console.log("Got valid image on (try " + try_number + ")");
            return saveImage(tweet, image_type);
        } else if (i < tweets.length + 1) {
            // Prob not a sun, keep looking :/
            console.log("Invalid image, checking next image (try " + try_number + ")");
            return checkTags(tweets, image_type, i + 1);
        } else {
            console.log("Failed to find valid image (try " + try_number + ")");
            return Promise.resolve("No image");
        }
    });
}

function fetchImages() {
    console.log("Starting image fetch");
    var promises = [
        search("#sunrise -sunset", "sunrise"),
        search("#sunset -sunrise", "sunset")
    ];

    Promise.all(promises).then(function() {
        console.log("Compleated fetching images");
    }).catch(function(err) {
        console.error("Error while fetching images:", err);
    });
}

console.log("Starting image fetch worker");
var job = schedule.scheduleJob('*/15 * * * *', fetchImages);