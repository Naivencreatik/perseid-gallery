Template.photoList.helpers({
    "photos": function(){
        return Perseid.colls.photos.find({albumId: this._id}, {sort:{name: 1}});
    }
});

Template.photoList.rendered = function(){
    var el = this.firstNode;
    var that = this;

    $(el).hide();

    imagesLoaded(el, function(){
        $(el).show();
        that.pckry = initializePackery(el);
    });
};

Template.photoList.destroyed = function(){
    this.pckry.destroy();
};

Template.photoThumb.events({
    "click": function(event, template){
        var photo = this;

        var $el = $(template.firstNode);
        var offset = $el.offset();
        photo.offset = offset;
        photo.animate = true;

        Session.set("photo.selected", photo);
    }
});

function initializePackery(el){
    var pckry = new Packery(el, {
        itemSelector: ".photo-thumb",
        gutter: 10,
        isInitLayout: false
    });

    pckry.on("layoutComplete", function(){
        var order = [];
        pckry.sortItemsByPosition();

        var elems = pckry.getItemElements();
        _.each(elems, function(elem, i){
            elem.setAttribute("order", i);
            order.push(elem.getAttribute("data-id"));
        });

        Session.set("album.order", order);
    });

    pckry.layout();

    return pckry;
}