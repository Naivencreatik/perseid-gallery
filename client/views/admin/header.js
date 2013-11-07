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
        Perseid.colls.albums.upload(this._id, input.files);
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
        var total = Perseid.colls.uploads.find().count();
        var error = Perseid.colls.uploads.find({state: "error"}).count();
        var pending = Perseid.colls.uploads.find({state: "pending"}).count();

        return {
            pending: pending,
            total: total - error,
            error: error
        };
    }
});

Template.adminUploadProgress.events({
    "click .upload-errors": function () {
        Perseid.colls.uploads.remove({state: "error"});
    }
});