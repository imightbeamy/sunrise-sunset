var request = require('request-promise');
var Promise = require('bluebird');

function getImageTags(url) {
    var options = {
        qs: {
            "url": url,
            "apikey": process.env.ALCHEMY_API_KEY,
            "outputMode": "json",
            "forceShowAll": 1,
        },
        url: "http://access.alchemyapi.com/calls/url/URLGetRankedImageKeywords"
    };

    return request.get(options).then(function(response) {
        response = JSON.parse(response);
        if (response.imageKeywords) {
            console.log("Got tags (count " + response.imageKeywords.length + ")");
            return response.imageKeywords;
        } else {
            console.log("Got no tags: " + response);
            return Promise.reject("Alchemy API failure");
        }
    });
}

module.exports = {
    getImageTags: getImageTags
};