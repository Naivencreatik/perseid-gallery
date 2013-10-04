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

        var file = event.dataTransfer.files[0];

        if (file.type.indexOf("image") !== 0) {
            return;
        }

        SmartFile.upload(file, function(err, uploadPath){
            if (err) {
                //XXX: proper user feedback ?
                console.log(err);
            }

            console.log(uploadPath);
        });
    }
});