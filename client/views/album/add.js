Template.albumAdd.events({
    "submit": function(event, template){
        event.preventDefault();

        var albumName = template.find("[name='albumName']").value;

        Meteor.call("album.add", albumName);
    }
});