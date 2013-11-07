Meteor.publish("albums", function(){
    return Perseid.colls.albums.find();
});

Meteor.publish("albumsThumbs", function(){
    var that = this;

    Perseid.colls.albums.find().forEach(function(album){
        var photoColl = Perseid.colls.photos;
        var thumb = photoColl.findOne({albumId: album._id}, {sort: photoColl.sort});

        // Albums can be empty
        if (thumb){
            that.added("photos", thumb._id, thumb);
        }
    });

    this.ready();
});

Meteor.publish("photos", function(albumId){
    return Perseid.colls.photos.find({albumId: albumId});
});
