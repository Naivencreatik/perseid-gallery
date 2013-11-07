var Albums = new Meteor.Collection("albums");
Gallery.colls.albums = Albums;

Albums.existenceCheck = function(albumId){
    var album = Gallery.colls.albums.findOne({_id: albumId});
    if (!album) {
        throw new Meteor.Error(404, "Unknown album");
    }

    return album;
};

Albums.conflictCheck = function(album){
    var conflictingAlbum = Gallery.colls.albums.findOne({name: name});
    if (conflictingAlbum) {
        throw new Meteor.Error(409, "Album " + name + " already exists");
    }
}