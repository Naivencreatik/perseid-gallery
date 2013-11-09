Template.album.created = function() {
    // Guests cannot d&d images...
    if (!Meteor.userId()) {
        return;
    }
    $(document.body).on("dragover.album", function(event) {
        //Ignore drags when the overlay is shown
        if (_.isObject(Session.get("photo.selected"))) {
            return;
        }

        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = "copy";

        Session.set("album.dragging", true);
    })
};

Template.album.destroyed = function() {
    $(document.body).off(".album");
};

Template.albumPhotoOverlay.helpers({
    "photoSelected": function() {
        return Session.get("photo.selected");
    }
});

Template.albumDropOverlay.helpers({
    dragging: function() {
        return Session.equals("album.dragging", true);
    }
});

Template.albumDropOverlay.events({
    "dragleave": function(event, template) {
        Session.set("album.dragging", false);
    },

    "drop": function(event, template) {
        if (!Meteor.userId()) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        Session.set("album.dragging", false);

        var albumId = this._id;
        var files = event.dataTransfer.files;

        Gallery.colls.albums.upload(albumId, files);
    }
});
