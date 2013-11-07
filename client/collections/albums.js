var Albums = Perseid.colls.albums;

var AlbumsUploads = new Meteor.Collection(null);
Perseid.colls.uploads = AlbumsUploads;

Albums.upload = function (id, files){
    files = _.toArray(files);

    _.each(files, function (file) {
        var fileId = AlbumsUploads.insert({name: file.name});    
        file.uploadId = fileId;
        
        var state = "pending";
        if (file.type.indexOf("image") !== 0) {
            state = "error";
        }
        
        changeUploadState(file, state);        
    });

    function uploadFile () {
        var file = files.shift();
        if (!file) return;

        SmartFile.upload(file, {albumId: id}, function(err, uploadPath){
            var state = "success";
            if (err) {
                state = "error";
            }
            changeUploadState(file, state);

            uploadFile();
        });
    }

    uploadFile();
};

function changeUploadState(file, state){
    AlbumsUploads.update({_id: file.uploadId}, {$set:{state: state}});
}

Meteor.methods({
    "album.delete": function(id){
        Albums.remove({_id: id});
    }
});