var Photos = new Meteor.Collection("photos");
Photos.sort = {date: 1};
Photos.sizes = [256, 512, 1024];

Perseid.colls.photos = Photos;

Photos.pathFor = function(photo, size){
    return photo.albumId + "/" + Photos.fileNameForSize(photo, size);
}; 

Photos.fileNameForSize = function(photo, size){
    var sizeSuffix = (size !== undefined) ? ("-" + size) : "";
    return photo.name + sizeSuffix + ".jpg";
}; 

Photos.existenceCheck = function(id){
    var photo = Perseid.colls.photos.findOne({_id: id});
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
