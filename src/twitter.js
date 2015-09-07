var request = require('request-promise');
var moment = require('moment');

function getBearerToken() {
	var api_key = process.env.API_KEY,
		api_secret = process.env.API_SECRET,
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

	return request.post(options).then(function(response) {
		return JSON.parse(response).access_token;
	});
}

function getTweets(access_token, query_list) {
	var query = query_list.join(" ");
	var options = {
		headers: {
			"Authorization": "Bearer " + access_token,
		},
		qs: {
			"q": query,
			"count": 1,
			"result_type": "recent",
			"include_entities": true
		},
		url: "https://api.twitter.com/1.1/search/tweets.json"
	};

	return request.get(options).then(function(response) {
		return JSON.parse(response).statuses;
	});
}

module.exports = {
	searchImages: function(query, count) {
		return getBearerToken().then(function(access_token) {
			return getTweets(access_token, [
				query,
				"filter:images",
				"since:" + moment().format('YYYY-MM-DD'),
			]);
		});
	}
};