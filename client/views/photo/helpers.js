Handlebars.registerHelper("photoImg", function(size){
    var photoPath = SmartFile.basePublicUrl + "/" + this.albumId + "/" + this.name + "-";
    photoPath += (size === "thumb") ? 256 : 512;
    photoPath += ".jpg";

    photoPath = Handlebars._escape(photoPath);

    var photoName = Handlebars._escape(this.name);

    var imgEl = "<img src='" + photoPath + "' alt='" + photoName + "'></img>";

    return new Handlebars.SafeString(imgEl);
});