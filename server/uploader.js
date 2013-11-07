var fs = Npm.require("fs");
var path = Npm.require("path");
var writeFileSync = Meteor._wrapAsync(fs.writeFile);
var readFileSync = Meteor._wrapAsync(fs.readFile);
var tmpDir = process.env.TMP || process.env.TMPDIR || process.env.TEMP || "/tmp" || process.cwd();

var sf = Gallery.smartfile;

sf.allow = function (options){
    var baseName = stripExtension(options.fileName);

    Gallery.colls.photos.conflictCheck({name: baseName, albumId: options.albumId});
    Gallery.colls.albums.existenceCheck(options.albumId);

    //Force photo to be stored within album directory
    options.path = options.albumId;
    options.name = baseName;

    return true;
};

sf.onUpload = function (result, options){
    Gallery.colls.photos.insert({
        albumId: options.albumId,
        name: options.name,
        date: new Date()
    });
};

sf.onUploadFail = function (err, options){
    console.log("SmartFile upload failed: ", err.statusCode, err.detail);
};

sf.onIncomingFile = function (data, options){
    var tmpFile = writeBufferToTempFile(data, options.fileName);
    data = null; //discard the original buffer for GCing

    var uploadQueue = [tmpFile];

    Gallery.colls.photos.sizes.forEach(function(size){
        var actualfileName = Gallery.colls.photos.fileNameForSize(options, size);
        var resizedFile = path.resolve(tmpDir, actualfileName);

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

        var r = sf.save(readFileSync(f), newOptions);

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

function stripExtension(fileName){
    var extension = path.extname(fileName);
    return path.basename(fileName, extension);
}

function writeBufferToTempFile(buffer, fileName){
    var tmpFile = path.resolve(tmpDir, fileName);
    writeFileSync(tmpFile, buffer);
    return tmpFile;
}