Template.albumList.helpers({
    "albums": function(){
        return Perseid.colls.albums.find();
    }
});

Template.albumThumb.helpers({
    "thumbImg": function(){
        return Perseid.colls.photos.findOne({albumId: this._id});
    }
});