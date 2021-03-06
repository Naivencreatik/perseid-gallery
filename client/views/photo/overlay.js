var $window = $(window);

var transformProperty = getStyleProperty("transform");

var transitionEndEvent = {
    WebkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    OTransition: "otransitionend",
    transition: "transitionend"
}[ getStyleProperty("transition") ];

Template.photoOverlayImg.rendered = function() {
    var el = this.firstNode;
    var imgEl = this.find("img");
    var photo = this.data;
    var animate = photo.animate;

    applyStyle(el, "transformOrigin", "0 0", true);
    applyStyle(imgEl, "display", "none");

    if (animate) {
        delete photo.animate;

        moveElement(el, photo.offset.left, photo.offset.top - $window.scrollTop());

        el.addEventListener(transitionEndEvent, function(event) {
            onOverlayDisplayed(el, photo);
            applyStyle(el, "transitionProperty", "", true);
            applyStyle(el, "transitionDuration", "", true);
        }, false);
    }

    imagesLoaded(el, function() {
        onOverlayLoaded(el, imgEl, animate);

        if (!animate) {
            onOverlayDisplayed(el, photo);
        }
    });

    $(window).on("resize.photo-overlay", _.debounce(function() {
        onOverlayLoaded(el, imgEl, false);
        onOverlayDisplayed(el, photo);
    }, 250));

    prepareNextAndPrevPhotos(this.data);
};

Template.photoOverlayImg.destroyed = function() {
    $(window).off(".photo-overlay");
};

function onOverlayLoaded(overlayEl, imgEl, animate) {
    var imgRatio = imgEl.width / imgEl.height;
    var wWidth = $window.width();
    var wHeight = $window.height();

    var targetHeight = wHeight * 0.9;
    var targetWidth = targetHeight * imgRatio;

    // Width overflow
    if (targetWidth > wWidth) {
        targetWidth = wWidth * 0.9;
        targetHeight = targetWidth / imgRatio;
    }

    // 256 = thumbnail heigth
    var scale = targetHeight / 256;

    var x = wWidth/2 - targetWidth/2;
    var y = wHeight/2 - targetHeight/2;

    if (animate) {
        applyStyle(overlayEl, "transitionProperty", transformProperty, true);
        applyStyle(overlayEl, "transitionDuration", "0.8s", true);
    }

    applyStyle(imgEl, "display", "");
    moveElement(overlayEl, x, y, scale);

    overlayEl._transform = {
        x: x,
        y: y,
        width: targetWidth,
        height: targetHeight
    };
}

function onOverlayDisplayed(overlayEl, photo) {
    if (photo.type === "youtube") {
        var iframe = overlayEl.querySelector("iframe");

        if (iframe === null) {
            iframe = document.createElement("iframe");
            iframe.setAttribute("frameborder", "0");
            iframe.style.position = "absolute";
            iframe.style.top = 0;
            iframe.style.left = 0;
            iframe.style.zIndex = 999;
            iframe.src = "http://www.youtube.com/embed/" + photo.youtube.videoId + "?autoplay=1&html5=1";

            iframe.onload = function() {
                var preview = overlayEl.querySelector("img");
                overlayEl.removeChild(preview);
            };
        }

        iframe.setAttribute("width", overlayEl._transform.width);
        iframe.setAttribute("height", overlayEl._transform.height);

        // Ditch the scale() transform, it would mess up the YouTube player
        applyStyle(overlayEl, "transition", "", true);
        applyStyle(overlayEl, "width", overlayEl._transform.width + "px");
        applyStyle(overlayEl, "height", overlayEl._transform.height + "px");
        moveElement(overlayEl, overlayEl._transform.x, overlayEl._transform.y);

        overlayEl.appendChild(iframe);
    }
}

function prepareNextAndPrevPhotos(currentPhoto) {
    var photoOrder = Session.get("album.order");
    var i = _.indexOf(photoOrder, currentPhoto._id);

    var prev = (i>0) ? photoOrder[i-1] : null;
    var next = (i+1<photoOrder.length) ? photoOrder[i+1] : null;

    Session.set("album.order.next", next);
    Session.set("album.order.prev", prev);
}

/* CSS Helpers*/
function applyStyle(el, prop, value, resolve) {
    if (resolve) {
        prop = getStyleProperty(prop);
    }

    el.style[prop] = value;
}

function moveElement(el, x, y, scale) {
    var tranform = "translate(" + x + "px, " + y + "px)";

    if (scale) {
        tranform += " scale(" + scale +")";
    }

    applyStyle(el, "transform", tranform, true);
}

Template.photoOverlay.events({
    "click": function() {
        Session.set("photo.selected", null);
    },
    "click .photo-overlay-prev": function(event) {
        event.stopPropagation();
        Session.set("photo.selected", Gallery.colls.photos.findOne({_id: Session.get("album.order.prev")}));
    },
    "click .photo-overlay-next": function(event) {
        event.stopPropagation();
        Session.set("photo.selected", Gallery.colls.photos.findOne({_id: Session.get("album.order.next")}));
    }
});

Template.photoOverlayNav.helpers({
    "navigation": function() {
        return {
            prev: !!Session.get("album.order.prev"),
            next: !!Session.get("album.order.next")
        };
    }
});
