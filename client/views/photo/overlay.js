Template.photoOverlay.events({
    "click": function(){
        Session.set("photo.selected", null);
    }
});

Template.photoOverlay.rendered = function(){
    var that = this;
    var photo = Session.get("photo.selected");
    var el = this.firstNode;

    //position overlay on top of the original photo
    applyTranslate(el, photo.offset.left, photo.offset.top);

    imagesLoaded(el, function(){
        var img = that.find("img");
        var imgRatio = img.width / img.height;

        var wWidth = $(window).width();
        var wHeight = $(window).height();

        var finalHeight = wHeight * 0.9;
        var finalWidth = finalHeight * imgRatio;

        var x = wWidth/2 - finalWidth/2;
        var y = wHeight * 0.05;

        applyTranslate(el, x, y);
        applyStyle(el, "height", "90%");
    });
};

function applyStyle(el, prop, value, resolve) {
    if (resolve){
        prop = getStyleProperty(prop);
    }

    el.style[prop] = value;
}

function applyTranslate(el, x, y){
    var translate = "translate(" + x + "px, " + y + "px)";
    applyStyle(el, "transform", translate, true);
}