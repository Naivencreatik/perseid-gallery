Handlebars.registerHelper("photoImg", function(size){
    var photoPath;

    if (!this.type){
        photoPath = imgFromSmartFile(this, size);
    }
    else if (this.type === "youtube"){
        photoPath = this.youtube.artwork;
    }

    photoPath = Handlebars._escape(photoPath);

    var photoName = Handlebars._escape(this.name);

    var imgEl = "<img src='" + photoPath + "' alt='" + photoName + "'></img>";

    return new Handlebars.SafeString(imgEl);
});

function imgFromSmartFile(photo, size){
    var photoSize;
    switch (size){
    case "thumb":
        photoSize = 256;
        break;
    case "medium":
        photoSize = 512;
        break;
    case "big":
        photoSize = 1024;
        break;
    }

    var photoPath = Gallery.colls.photos.pathFor(photo, photoSize);

    return SmartFile.resolvePublic(photoPath);
}