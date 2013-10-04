Handlebars.registerHelper("photoImg", function(){
    var photoPath = SmartFile.basePublicUrl + "/" + this.albumId + "/" + this.name;
    photoPath = Handlebars._escape(photoPath);

    var photoName = Handlebars._escape(this.name);

    var imgEl = "<img src='" + photoPath + "' alt='" + photoName + "'></img>";

    return new Handlebars.SafeString(imgEl);
});