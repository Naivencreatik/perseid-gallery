Template.photoList.helpers({
    "photos": function(){
        return Perseid.colls.photos.find({albumId: this._id});
    }
});