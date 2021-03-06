Template.albumList.helpers({
    "albums": function() {
        return Gallery.colls.albums.find();
    }
});

Template.albumThumb.events({
    "click .btn-delete": function(event) {
        if (confirm("Voulez vous vraiment supprimer cet album?")) {
            Meteor.call("album.delete", this._id);
        }
    }
});

Template.albumThumb.helpers({
    "thumbImg": function() {
        return Gallery.colls.photos.findOne({albumId: this._id});
    },
    "deleteMode": function() {
        return Session.get("albums.delete");
    }
});