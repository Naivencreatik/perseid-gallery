Template.albumList.helpers({
    "albums": function(){
        return Perseid.collections.albums.find();
    }
});