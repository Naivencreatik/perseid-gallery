Meteor.publish("albums", function(){
    return Perseid.colls.albums.find();
});

Meteor.publish("photos", function(albumId){
    return Perseid.colls.photos.find({albumId: albumId});
});

SmartFile.allow = function (options){
    //Album existence check
    var album = Perseid.colls.albums.findOne({_id: options.albumId});
    if (!album) {
        throw new Meteor.Error(404, "Unknown album");
    }

    //Photo name check
    var conflictingPhoto = Perseid.colls.photos.findOne({
        name: options.fileName,
        albumId: album._id
    });

    if (conflictingPhoto) {
        throw new Meteor.Error(409, "Photo '" + options.fileName + "' already exists within the album");
    }

    //Force photo to be stored within album directory
    options.path = options.albumId;

    return true;
};

SmartFile.onUpload = function (result, options){
    Perseid.colls.photos.insert({
        albumId: options.albumId,
        name: options.fileName,
        date: new Date()
    });
};

SmartFile.onUploadFail = function (result, options){
    console.log("Fail: ", result);
};