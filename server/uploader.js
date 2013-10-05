var fs = Npm.require("fs");
var path = Npm.require("path");
var writeFileSync = Meteor._wrapAsync(fs.writeFile);
var readFileSync = Meteor._wrapAsync(fs.readFile);
var tmpDir = process.env.TMP || process.env.TMPDIR || process.env.TEMP || "/tmp" || process.cwd();

SmartFile.allow = function (options){
    //Album existence check
    var album = Perseid.colls.albums.findOne({_id: options.albumId});
    if (!album) {
        throw new Meteor.Error(404, "Unknown album");
    }

    //Photo name check
    var conflictingPhoto = Perseid.colls.photos.findOne({
        name: options.fileName,
        albumId: album._id
    });

    if (conflictingPhoto) {
        throw new Meteor.Error(409, "Photo '" + options.fileName + "' already exists within the album");
    }

    //Force photo to be stored within album directory
    options.path = options.albumId;

    return true;
};

SmartFile.onUpload = function (result, options){
    var extension = path.extname(options.fileName);
    var baseName = path.basename(options.fileName, extension);

    Perseid.colls.photos.insert({
        albumId: options.albumId,
        name: baseName,
        originalName: options.fileName,
        date: new Date()
    });
};

SmartFile.onUploadFail = function (result, options){
    console.log("Fail: ", result);
};

function writeBufferToTempFile(buffer, fileName){
    var tmpFile = path.resolve(tmpDir, fileName);
    writeFileSync(tmpFile, buffer);
    return tmpFile;
}

SmartFile.onIncomingFile = function (data, options){
    var tmpFile = writeBufferToTempFile(data, options.fileName);
    data = null; //discard the original buffer for GCing

    var extension = path.extname(tmpFile);
    var baseName = path.basename(tmpFile, extension);

    var uploadQueue = [tmpFile];

    [256, 512].forEach(function(size){
        var resizedFile = path.resolve(tmpDir, baseName + "-" + size + ".jpg");

        Imagemagick.resize({
            srcPath: tmpFile,
            dstPath: resizedFile,
            height: size
        });

        uploadQueue.push(resizedFile);
    });

    var results = [];
    uploadQueue.forEach(function(f){
        var newOptions = populate({}, options)
        newOptions.fileName = path.basename(f);

        var r = SmartFile.upload(readFileSync(f), newOptions);

        results.push(r);

        fs.unlink(f);
    });

    return results[0];
};

function populate(dst, src) {
    for (var prop in src) {
        if (!dst[prop]) dst[prop] = src[prop];
    }
    return dst;
}
