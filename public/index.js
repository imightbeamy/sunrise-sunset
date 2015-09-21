var current = more_suns.length - 1,
    suns = document.querySelectorAll(".sun"),
    back = document.querySelector(".back"),
    forward = document.querySelector(".forward");

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

var next = function() { updateImages(1); },
    prev = function() { updateImages(-1); };

function initTouch() {
    // Buttons
    forward.ontouchstart = next;
    back.ontouchstart = prev;

    // Mobile "scroll"
    var touch_x;
    document.ontouchstart = function(e) {
        touch_x = e.changedTouches[0].clientX;
    }
    document.ontouchmove = function(e) {
        var new_touch_x = e.changedTouches[0].clientX;
        if (Math.abs(touch_x - new_touch_x) > 3) {
            updateImages(new_touch_x > touch_x ? 1 : -1);
            touch_x = new_touch_x;
        }
    }
}

function initMouse() {
    // Buttons
    forward.onclick = next;
    back.onclick = prev;

    // Scroll
    window.onwheel = function(e) {
        e.preventDefault();
        if (e.deltaX) {
            updateImages(e.deltaX > 0 ? 1 : -1);
        }
    }

    // Arrow keys
    document.onkeydown = function(e) {
        switch(e.which) {
            case 37: prev(); break; // left
            case 39: next(); break; // right
        }
    };
}

// Add time to inital images (in the client timezone / format)
updateImages(0);

// Init interactions for phones or desktop/mouse
if ('ontouchstart' in document.documentElement) {
    initTouch();
} else {
    initMouse();
}

// Refresh every 15 minutes
setTimeout(function() {
    window.location.reload(true);
}, 1000 * 60 * 15);