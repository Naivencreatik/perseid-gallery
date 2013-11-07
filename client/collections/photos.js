Meteor.methods({
    "photo.delete": function(id){
        Gallery.colls.photos.remove({_id: id});
    }
});