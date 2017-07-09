"use strict";

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

function getImageTags(url) {
    var visual_recognition = new VisualRecognitionV3({
      api_key: process.env.WATSON_VISION_API_KEY,
      version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
    });

    return new Promise(function(resolve, reject){
        visual_recognition.classify({
            url: url
        }, (err, response) => {
            if (err)
                reject(err)
            else
                resolve(response)
        })
    }).then(response => {
        var tags = response.images && response.images[0].classifiers[0].classes
        if (tags) {
            console.log("Got tags (count " + tags.length + ")");
            return tags;
        } else {
            console.log("Got no tags: " + response);
            return Promise.reject("Alchemy API failure");
        }
    });
}

module.exports = {
    getImageTags: getImageTags
};