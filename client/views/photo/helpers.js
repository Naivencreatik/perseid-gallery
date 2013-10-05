Handlebars.registerHelper("photoImg", function(size){
    var photoPath = SmartFile.basePublicUrl + "/" + this.albumId + "/" + this.name + "-";

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

    photoPath += photoSize;
    photoPath += ".jpg";

    photoPath = Handlebars._escape(photoPath);

    var photoName = Handlebars._escape(this.name);

    var imgEl = "<img src='" + photoPath + "' alt='" + photoName + "'></img>";

    return new Handlebars.SafeString(imgEl);
});