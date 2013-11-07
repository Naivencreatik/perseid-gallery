var Photos = Gallery.colls.photos;
var Albums = Gallery.colls.albums;

var ytRegex = new RegExp("(?:https?://)?www\\.youtube\\.com/watch(?:\\?|&)v=([^\\s&]+)");

Meteor.methods({
    "album.add": function(name){
        Perseid.checkUserId(this.userId);
        check(name, Perseid.match.AlphaNumericNonEmptyString);

        var album = {name: name};
        Albums.conflictCheck(album);

        var id = Albums.insert(album);
        try {
            SmartFile.mkdir(id);
        } catch (e) {
            Albums.remove({_id: id});
            throw new Meteor.Error(500, e.message);
        }
    },

    "album.delete": function(id){
        Perseid.checkUserId(this.userId);
        var album = Albums.existenceCheck(id);

        SmartFile.rm(id);
        
        Photos.remove({albumId: id});
        Albums.remove({_id: id});
    },

    "photo.add.youtube": function(albumId, youtubeUrl){
        Perseid.checkUserId(this.userId);

        var match = ytRegex.exec(youtubeUrl);
        if (!match){
            throw new Meteor.Error(400, "Bad YouTube URL");
        }

        Albums.existenceCheck(albumId);

        var videoId = match[1];
        var result = Meteor.http.get("http://gdata.youtube.com/feeds/api/videos/"+videoId+"?v=2&alt=json");

        var entry = result.data.entry;
        var url = _.findWhere(entry.link, {rel: "alternate"}).href;
        var artworkUrl = _.findWhere(entry.media$group.media$thumbnail, {yt$name: "hqdefault"}).url;

        var ytPhoto = {
            albumId: albumId,
            name: entry.title.$t,
            type: "youtube",
            youtube: {
                videoId: videoId,
                duration: entry.media$group.yt$duration.seconds * 1000,
                artwork: artworkUrl,
                url: url
            }
        };

        Photos.conflictCheck(ytPhoto);
        Photos.insert(ytPhoto);
    },

    "photo.delete": function(id){
        Perseid.checkUserId(this.userId);

        var photo = Gallery.colls.photos.existenceCheck(id);

        if (photo.type !== "youtube"){
            var paths = Photos.sizes.map(function(size){
                return Photos.pathFor(photo, size);
            });
            paths.push(Photos.pathFor(photo)); //original upload

            var res = SmartFile.rm(paths);
        }

        Photos.remove({_id: id});
    }
});
