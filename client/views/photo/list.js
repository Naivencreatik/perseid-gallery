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

        that.pckry = new Packery(el, {
            itemSelector: ".photo-thumb",
            gutter: 10
        });
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

        Session.set("photo.selected", photo);
    }
});