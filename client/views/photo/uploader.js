function uploadImage (file, albumId){
    if (file.type.indexOf("image") !== 0) {
        return;
    }

    SmartFile.upload(file, {albumId: albumId}, function(err, uploadPath){
        if (err) {
            //XXX: proper user feedback ?
            console.log(err);
        }

        console.log(uploadPath);
    });
}

Template.photoUploader.events({
    "dragover": function (event, template) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    },

    "dragenter": function (event, template) {
        $(template.firstNode).addClass("dragging");
    },

    "dragleave": function (event, template) {
        $(template.firstNode).removeClass("dragging");
    },

    "drop": function (event, template) {
        event.stopPropagation();
        event.preventDefault();

        var albumId = this._id;

        var files = event.dataTransfer.files;
        for (var i = 0, len = files.length; i < len; i++) {
            uploadImage(files[i], albumId);
        }
    }
});

