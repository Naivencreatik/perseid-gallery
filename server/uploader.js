var fs = Npm.require("fs");
var path = Npm.require("path");
var writeFileSync = Meteor._wrapAsync(fs.writeFile);
var readFileSync = Meteor._wrapAsync(fs.readFile);
var tmpDir = process.env.TMP || process.env.TMPDIR || process.env.TEMP || "/tmp" || process.cwd();

SmartFile.allow = function (options){
    Perseid.colls.albums.prePhotoInsertCheck({
        name: stripExtension(options.fileName),
        albumId: options.albumId
    });

    //Force photo to be stored within album directory
    options.path = options.albumId;

    return true;
};

SmartFile.onUpload = function (result, options){
    Perseid.colls.photos.insert({
        albumId: options.albumId,
        name: stripExtension(options.fileName),
        date: new Date()
    });
};

function stripExtension(fileName){
    var extension = path.extname(fileName);
    return path.basename(fileName, extension);
}

SmartFile.onUploadFail = function (result, options){
    console.log("SmartFile upload failed: ", result);
};

function writeBufferToTempFile(buffer, fileName){
    var tmpFile = path.resolve(tmpDir, fileName);
    writeFileSync(tmpFile, buffer);
    return tmpFile;
}

SmartFile.onIncomingFile = function (data, options){
    var tmpFile = writeBufferToTempFile(data, options.fileName);
    data = null; //discard the original buffer for GCing


    var uploadQueue = [tmpFile];

    [256, 512, 1024].forEach(function(size){
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
