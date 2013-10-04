Handlebars.registerHelper("photoImg", function(){
    var photoPath = Handlebars._escape(SmartFile.basePublicUrl + "/" + this.name);
    var photoName = Handlebars._escape(this.name);

    var imgEl = "<img src='" + photoPath + "' alt='" + photoName + "'></img>";

    return new Handlebars.SafeString(imgEl);
});