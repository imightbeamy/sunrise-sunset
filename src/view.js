"use strict";
var moment = require('moment');

var PAIR_WINDOW = 1000 * 60 * 5; // 5 minutes

function pairImages(sunrises, sunsets) {
    var pairs = [];
    for (var i = 0; i < sunrises.length; i++) {
        for (var j = 0; j < sunsets.length; j++ ) {
            var sunrise_time = sunrises[i].create_date.getTime();
            var sunset_time = sunsets[j].create_date.getTime();
            if (Math.abs(sunrise_time - sunset_time) < PAIR_WINDOW) {
                // A match made in the heavens
                pairs.push([ sunrises[i], sunsets[j] ]);
                break;
            }
        }
    }
    return pairs;
}

function tweetData(tweet) {
    return {
        status_url: "https://twitter.com/" + tweet.handle + "/statuses/" + tweet.tweet_id,
        img_url: tweet.tweet_img_url + ":large",
        info: "@" + tweet.handle,
        time: moment(tweet.tweet_created_at).utc().format()
    };
}

module.exports = {
    indexData: function(tweet_sets) {
        var suns = pairImages(tweet_sets[0], tweet_sets[1]);
        return {
            inital_suns: suns[0].map(tweet => tweetData(tweet)),
            more_suns: JSON.stringify(suns.map(set => set.map(tweetData))),
            sun_count: suns.length - 1,
            bar_width: suns.length * 5
        };
    },
    tweetData: tweetData
};