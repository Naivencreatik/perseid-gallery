Meteor.publish("albums", function(){
    return Perseid.colls.albums.find();
});

Meteor.publish("photos", function(albumId){
    return Perseid.colls.photos.find({albumId: albumId});
});
