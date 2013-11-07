Template.adminAlbumListActions.events({
    "click button": function (event, template){
        var albumName = prompt("Nom du nouvel album?");
        Meteor.call("album.add", albumName);
    }
});

Template.adminAddImage.events({
    "click button": function (event, template){
        template.find("input").click();
    },

    "change input": function(event, template){
        var input = event.target;        
        Perseid.colls.albums.upload(this._id, input.files);
    }
});

Template.adminAddYoutube.events({
    "click button": function (event, template){
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