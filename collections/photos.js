var Photos = new Meteor.Collection("photos");
Photos.sort = {date: 1};

Perseid.colls.photos = Photos;

Photos.existenceCheck = function(id) {
    var photo = Perseid.colls.photos.find({_id: id});
    if (!photo){
        throw new Meteor.Error(404, "Unknown photo");
    }

    return photo;
};

Photos.conflictCheck = function(photo){
    var conflictingPhoto = Perseid.colls.photos.findOne({
        name: photo.name,
        albumId: photo.albumId
    });

    if (conflictingPhoto) {
        throw new Meteor.Error(409, "Photo '" + photo.name + "' already exists within the album");
    }
};
