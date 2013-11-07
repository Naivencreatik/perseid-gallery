Template.adminAlbumListActions.events({
    "click .album-add": function (event, template){
        var albumName = prompt("Nom du nouvel album?");
        Meteor.call("album.add", albumName);
    },
    "click .album-delete": function () {
        Session.set("albums.delete", !Session.get("albums.delete"));
    }
});

Template.adminAlbumActions.events({
    "click .photo-delete": function () {
        Session.set("photos.delete", !Session.get("photos.delete"));
    }
});

Template.adminAddImage.events({
    "click button": function (event, template){
        template.find("input").click();
    },

    "change input": function(event, template){
        var input = event.target;        
        Gallery.colls.albums.upload(this._id, input.files);
        input.form.reset();
    }
});

Template.adminAddYoutube.events({
    "click button": function (event, template){
        var youtubeUrl = prompt("Adresse/URL Youtube?");
        Meteor.call("photo.add.youtube", this._id, youtubeUrl);
    }
});

Template.adminUploadProgress.helpers({
    "stats": function() {
        var total = Gallery.colls.uploads.find().count();
        var error = Gallery.colls.uploads.find({state: "error"}).count();
        var success = Gallery.colls.uploads.find({state: "success"}).count();
        var hasPending = Gallery.colls.uploads.find({state: "pending"}).count() !== 0;

        return {
            hasPending: hasPending,
            success: success,
            total: total - error,
            error: error
        };
    }
});

Template.adminUploadProgress.events({
    "click .upload-errors": function () {
        Gallery.colls.uploads.remove({state: "error"});
    }
});