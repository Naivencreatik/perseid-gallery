var $window = $(window);

var transitionEndEvent = {
    WebkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    OTransition: "otransitionend",
    transition: "transitionend"
}[ getStyleProperty("transition") ];

Template.photoOverlayImg.rendered = function(){
    var el = this.firstNode;
    var img = this.find("img");
    var photo = this.data;
    var animate = photo.animate;

    Session.set("photo.overlay.loading", photo._id);

    applyStyle(img, "display", "none");

    if (animate){
        delete photo.animate;

        moveElement(el, photo.offset.left, photo.offset.top - $window.scrollTop());

        $(el).one(transitionEndEvent, function(event){
            onOverlayTransitionEnd(el, photo);
        });
    }

    imagesLoaded(el, function(){
        Session.set("photo.overlay.loading", null);
        onOverlayImageLoaded(el, img, animate);

        if (!animate){
            onOverlayTransitionEnd(el, photo);
        }
    });

    prepareNextAndPrevPhotos(this.data);
};

function onOverlayImageLoaded(overlayEl, imgEl, animate){
    var imgRatio = imgEl.width / imgEl.height;

    var wWidth = $window.width();
    var wHeight = $window.height();

    var finalHeight = wHeight * 0.9;
    var finalWidth = finalHeight * imgRatio;

    var x = wWidth/2 - finalWidth/2;
    var y = wHeight * 0.05;

    if (animate){
        applyStyle(overlayEl, "transition", "0.8s", true);
    }

    applyStyle(imgEl, "display", "");
    moveElement(overlayEl, x, y);
    applyStyle(overlayEl, "height", "90%");
}

function onOverlayTransitionEnd(overlayEl, photo){
    if (photo.type === "youtube"){
        var iframe = document.createElement("iframe");
        iframe.setAttribute("width", overlayEl.scrollWidth);
        iframe.setAttribute("height", overlayEl.scrollHeight);
        iframe.setAttribute("frameborder", "0");
        iframe.style.position = "absolute";
        iframe.style.top = 0;
        iframe.style.left = 0;
        iframe.style.zIndex = 999;
        iframe.src = "http://www.youtube.com/embed/" + photo.youtube.videoId + "?autoplay=1&html5=1";
        $(overlayEl).append(iframe);
    }
}

function prepareNextAndPrevPhotos(currentPhoto){
    var photoOrder = Session.get("album.order");
    var i = _.indexOf(photoOrder, currentPhoto._id);

    var prev = (i>0) ? photoOrder[i-1] : null;
    var next = (i+1<photoOrder.length) ? photoOrder[i+1] : null;

    Session.set("album.order.next", next);
    Session.set("album.order.prev", prev);
}

/* CSS Helpers*/
function applyStyle(el, prop, value, resolve){
    if (resolve){
        prop = getStyleProperty(prop);
    }

    el.style[prop] = value;
}

function moveElement(el, x, y){
    var translate = "translate(" + x + "px, " + y + "px)";
    applyStyle(el, "transform", translate, true);
}

Template.photoOverlay.events({
    "click": function(){
        Session.set("photo.selected", null);
    },
    "click .photo-overlay-prev": function(event){
        event.stopPropagation();
        Session.set("photo.selected", Perseid.colls.photos.findOne({_id: Session.get("album.order.prev")}));
    },
    "click .photo-overlay-next": function(event){
        event.stopPropagation();
        Session.set("photo.selected", Perseid.colls.photos.findOne({_id: Session.get("album.order.next")}));
    }
});

Template.photoOverlayNav.helpers({
    "navigation": function(){
        return {
            prev: !!Session.get("album.order.prev"),
            next: !!Session.get("album.order.next")
        };
    }
});
