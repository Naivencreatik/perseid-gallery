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

Template.photoOverlay.rendered = function(){
    var that = this;
    var $window = $(window);
    var el = this.firstNode;
    var img = this.find("img");

    Session.set("photo.overlay.loading", this.data._id);

    var needAnimation = this.data.animate;
    delete this.data.animate;

    applyStyle(img, "display", "none");

    if (needAnimation){
        moveElement(el, that.data.offset.left, that.data.offset.top - $window.scrollTop());
    }

    imagesLoaded(el, function(){
        Session.set("photo.overlay.loading", null);

        var imgRatio = img.width / img.height;

        var wWidth = $window.width();
        var wHeight = $window.height();

        var finalHeight = wHeight * 0.9;
        var finalWidth = finalHeight * imgRatio;

        var x = wWidth/2 - finalWidth/2;
        var y = wHeight * 0.05;

        if (needAnimation){
            applyStyle(el, "transition", "0.8s", true);
        }

        applyStyle(img, "display", "");

        Meteor.defer(function(){
            moveElement(el, x, y);
            applyStyle(el, "height", "90%");
        });
    });

    // Compute next and previous photos
    var photoOrder = Session.get("album.order");
    var i = _.indexOf(photoOrder, this.data._id);

    var prev = (i>0) ? photoOrder[i-1] : null;
    var next = (i+1<photoOrder.length) ? photoOrder[i+1] : null;

    Session.set("album.order.next", next);
    Session.set("album.order.prev", prev);
};

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

Template.photoOverlayNav.helpers({
    "navigation": function(){
        return {
            prev: !!Session.get("album.order.prev"),
            next: !!Session.get("album.order.next")
        };
    }
});
