Meteor.publish("albums", function(){
    return Perseid.colls.albums.find();
});

Meteor.publish("photos", function(albumId){
    return Perseid.colls.photos.find({albumId: albumId});
});

Meteor.startup(function(){
    if (Perseid.colls.albums.find().count() === 0){
        ["Album1", "Album2", "Album3"].forEach(function(name){
            var id = Perseid.colls.albums.insert({name: name});
        });
    }
});

SmartFile.allow = function (options){
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