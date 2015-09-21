var current = more_suns.length - 1;
var suns = document.querySelectorAll(".sun");

function setTweet(sun_image, tweet) {
    sun_image.style.backgroundImage = 'url("' + tweet.img_url + '")';
    sun_image.href = tweet.status_url;
    sun_image.children[0].innerHTML = 
        tweet.info + ", " + new Date(tweet.time).toLocaleTimeString();
}

function updateImages(change) {
    if (current + change >= 0 && current + change < more_suns.length) {
        current += change;
        var pair = more_suns[current];
        setTweet(suns[0], pair[0]);
        setTweet(suns[1], pair[1]);
    }
};

updateImages(0);

// Buttons
document.querySelector(".back").onclick = function() {
    updateImages(-1);
};
document.querySelector(".forward").onclick = function() {
    updateImages(1);
};

// Desktop scroll
window.onwheel = function(e) {
    e.preventDefault();
    if (e.deltaX) {
        updateImages(e.deltaX > 0 ? 1 : -1);
    }
}

// Arrow keys
document.onkeydown = function(e) {
    console.log(e.which);
    switch(e.which) {
        case 37: // left
        updateImages(-1);
        break;

        case 39: // right
        updateImages(1);
        break;
    }
};

// Mobile "scroll"
var touch_x;
document.ontouchstart = function(e) {
    touch_x = e.changedTouches[0].clientX;
}
document.ontouchmove = function(e) {
    var new_touch_x = e.changedTouches[0].clientX;
    updateImages(new_touch_x > touch_x ? 1 : -1);
    touch_x = new_touch_x;
}

// Refresh every 15 minutes
setTimeout(function() {
    window.location.reload(true);
}, 1000 * 60 * 15);