"use strict";
var request = require('request-promise');

function getBearerToken() {
    var api_key = process.env.TWITTER_API_KEY,
        api_secret = process.env.TWITTER_API_SECRET,
        api_token = encodeURIComponent(api_key) + ":" + encodeURIComponent(api_secret),
        authorization = new Buffer(api_token).toString('base64');

    var options = {
        headers: {
            "Authorization": "Basic " + authorization,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        form: {
            "grant_type": "client_credentials"
        },
        url: "https://api.twitter.com/oauth2/token"
    };

    return request.post(options).then(response => JSON.parse(response).access_token);
}

function getTweetData(tweet) {
    return {
        handle: tweet.user.screen_name,
        img_url: tweet.entities.media[0].media_url,
        tweet_id: tweet.id_str,
        tweet_text: tweet.text,
        tweet_created_at: tweet.created_at,
        tweet_location: tweet.location,
        image_type: "sunrise",
    };
}

function getTweets(access_token, query_list, count) {
    var query = query_list.join(" ");
    var options = {
        headers: {
            "Authorization": "Bearer " + access_token,
        },
        qs: {
            "q": query,
            "count": count,
            "result_type": "recent",
            "include_entities": true
        },
        url: "https://api.twitter.com/1.1/search/tweets.json"
    };

    return request.get(options).then(response => {
        response = JSON.parse(response);
        console.log("Got tweets for '" + query + "'' (count " + response.statuses.length + ")");
        return response.statuses.map(getTweetData);
    });
}

module.exports = {
    searchImages: (query_list, count) => {
        return getBearerToken()
                .then(access_token => getTweets(access_token, query_list, count));
    }
};