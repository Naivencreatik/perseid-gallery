Meteor.methods({
    "album.add": function(name){
        check(name, AlphaNumericNonEmptyString);

        var conflictingAlbum = Perseid.colls.albums.findOne({name: name});
        if (conflictingAlbum) {
            throw new Meteor.Error(409, "Album " + name + " already exists");
        }

        var id = Perseid.colls.albums.insert({name: name});

        try {
            SmartFile.mkdir(id);
        } catch (e) {
            Perseid.colls.albums.remove({_id: id});
            throw new Meteor.Error(500, e.message);
        }
    }
});