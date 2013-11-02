var Albums = Perseid.colls.albums;

var AlbumsUploads = new Meteor.Collection(null);
Perseid.colls.uploads = AlbumsUploads;

Albums.upload = function (id, files){
    _.each(files, function (file) {
        var fileId = AlbumsUploads.insert({name: file.name});    
        file.uploadId = fileId;

        changeUploadState(file, "pending");        
    });

    _.each(files, function(file){
        if (file.type.indexOf("image") !== 0) {
            changeUploadState(file, "fail");
            return;
        }

        SmartFile.upload(file, {albumId: id}, function(err, uploadPath){
            if (err) {
                changeUploadState(file, "fail");
            }
            else {
                changeUploadState(file, "success");
            }
        });
    });
};

function changeUploadState(file, state){
    AlbumsUploads.update({_id: file.uploadId}, {$set:{state: state}});
}