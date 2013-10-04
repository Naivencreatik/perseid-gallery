Template.albumList.helpers({
    "albums": function(){
        return Perseid.colls.albums.find();
    }
});