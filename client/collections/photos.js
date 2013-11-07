Meteor.methods({
    "photo.delete": function(id){
        Perseid.colls.photos.remove({_id: id});
    }
});