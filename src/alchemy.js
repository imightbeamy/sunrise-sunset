var request = require('request-promise');

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
        console.log("Got tags. Count: " + response.imageKeywords.length);
        return response.imageKeywords;
    });
}

module.exports = {
    getImageTags: getImageTags
};