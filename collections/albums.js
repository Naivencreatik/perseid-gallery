var Albums = new Meteor.Collection("albums");
Perseid.colls.albums = Albums;

Albums.prePhotoInsertCheck = function(photo){
    //Album existence check
    var album = Perseid.colls.albums.findOne({_id: photo.albumId});
    if (!album) {
        throw new Meteor.Error(404, "Unknown album");
    }

    //Photo name check
    var conflictingPhoto = Perseid.colls.photos.findOne({
        name: photo.name,
        albumId: photo.albumId
    });

    if (conflictingPhoto) {
        throw new Meteor.Error(409, "Photo '" + photo.name + "' already exists within the album");
    }
};