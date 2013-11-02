Template.photoAddFile.events({
    "click button": function (event, template){
        event.preventDefault();
        template.find("input").click();
    },

    "change input": function(event, template){
        var input = event.target;
        
        Perseid.colls.albums.upload(this._id, input.files);

        input.form.reset();
    }
});

Template.photoAddYoutube.events({
    "submit": function (event, template){
        event.preventDefault();
        var youtubeUrl = template.find("[name='youtubeUrl']").value;
        Meteor.call("album.embed.youtube", this._id, youtubeUrl);
    }
});