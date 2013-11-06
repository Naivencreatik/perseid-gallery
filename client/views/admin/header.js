Template.adminAlbumListActions.events({
    "click a": function (event, template){
        event.preventDefault();
        var albumName = prompt("Nom du nouvel album?");
        Meteor.call("album.add", albumName);
    }
});

Template.adminAddImage.events({
    "click a": function (event, template){
        event.preventDefault();
        template.find("input").click();
    },

    "change input": function(event, template){
        var input = event.target;
        
        Perseid.colls.albums.upload(this._id, input.files);

        input.form.reset();
    }
});

Template.adminAddYoutube.events({
    "click a": function (event, template){
        event.preventDefault();
        var youtubeUrl = prompt("Adresse/URL Youtube?");
        Meteor.call("photo.add.youtube", this._id, youtubeUrl);
    }
});

Template.adminUploadProgress.helpers({
    "success": function() {
        return Perseid.colls.uploads.find({state: "success"}).count();
    },
    "total": function() {
        return Perseid.colls.uploads.find({}).count();
    }
});