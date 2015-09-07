module.exports = {
    indexData: function(search_results) {
        return {
            suns: search_results.map(function (tweets) {
                return tweets[0];
            })
        };
    }
};