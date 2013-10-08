Template.youtubeForm.events({
    "submit": function (event, template){
        event.preventDefault();
        var youtubeUrl = template.find("[name='youtubeUrl']").value;
        Meteor.call("album.embed.youtube", this._id, youtubeUrl);
    }
});