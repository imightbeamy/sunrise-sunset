function sunTweets(tweets) {
	var tweet = tweets[0];
	return {
		img_url: tweet.entities.media[0].media_url,
		handle: tweet.user.screen_name,
		status_url: "https://twitter.com/statuses/" + tweet.id_str
	};
};

module.exports = {
	indexData: function(search_results) {
		return {
			suns: search_results.map(sunTweets)
		};
	}
};