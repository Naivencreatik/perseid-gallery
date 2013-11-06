Template.album.events({
    "dragover": function (event, template) {
        //Ignore drags when the overlay is shown
        if (_.isObject(Session.get("photo.selected"))){
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        Session.set("album.dragging", true);
    }
});

Template.albumPhotoOverlay.helpers({
    "photoSelected": function(){
        return Session.get("photo.selected");
    }
});

Template.albumDragOverlay.helpers({
    dragging: function(){
        return Session.equals("album.dragging", true);
    }
});

Template.albumDragOverlay.events({
    "dragleave": function (event, template) {
        Session.set("album.dragging", false);
    },

    "drop": function (event, template) {
        event.stopPropagation();
        event.preventDefault();
        
        Session.set("album.dragging", false);

        var albumId = this._id;
        var files = event.dataTransfer.files;

        Perseid.colls.albums.upload(albumId, files);
    }
});
