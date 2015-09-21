var current = more_suns.length - 1;
var suns = document.querySelectorAll(".sun");

function setTweet(sun_image, tweet) {
    sun_image.style.backgroundImage = 'url("' + tweet.img_url + '")';
    sun_image.href = tweet.status_url;
    sun_image.children[0].innerHTML = 
        tweet.info + ", " + new Date(tweet.time).toLocaleTimeString();
}

function update(change) {
    if (current + change >= 0 && current + change < more_suns.length) {
        current += change;
        var pair = more_suns[current];
        setTweet(suns[0], pair[0]);
        setTweet(suns[1], pair[1]);
    }
};

update(0);

// Buttons
document.querySelector(".back").onclick = function() {
    update(-1);
};
document.querySelector(".forward").onclick = function() {
    update(1);
};

// Desktop scroll
window.onwheel = function(e) {
    e.preventDefault();
    if (e.deltaX) {
        update(e.deltaX > 0 ? 1 : -1);
    }
}

// Arrow keys
document.onkeydown = function(e) {
    console.log(e.which);
    switch(e.which) {
        case 37: // left
        update(-1);
        break;

        case 39: // right
        update(1);
        break;
    }
};

// Refresh every 15 minutes
setTimeout(function() {
    window.location.reload(true);
}, 1000 * 60 * 15);