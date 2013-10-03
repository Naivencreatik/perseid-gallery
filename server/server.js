Meteor.startup(function(){
    if (Perseid.collections.albums.find().count() === 0){
        Perseid.collections.albums.insert({name: "Album 1"});
        Perseid.collections.albums.insert({name: "Album 2"});
        Perseid.collections.albums.insert({name: "Album 3"});
    }
});