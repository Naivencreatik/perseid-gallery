var Albums = new Meteor.Collection("albums");
Perseid.colls.albums = Albums;

Albums.existenceCheck = function(albumId){
    var album = Perseid.colls.albums.findOne({_id: albumId});
    if (!album) {
        throw new Meteor.Error(404, "Unknown album");
    }

    return album;
};

Albums.conflictCheck = function(album){
    var conflictingAlbum = Perseid.colls.albums.findOne({name: name});
    if (conflictingAlbum) {
        throw new Meteor.Error(409, "Album " + name + " already exists");
    }
}