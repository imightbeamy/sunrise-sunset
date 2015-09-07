function tweetData(tweet) {
    return {
        status_url: "https://twitter.com/statuses/" + tweet.tweet_id,
        handle: tweet.handle,
        img_url: tweet.tweet_img_url
    };
}

module.exports = {
    indexData: function(tweets) {
        return {
            suns: tweets.map(tweetData)
        };
    }
};