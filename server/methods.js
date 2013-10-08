var ytRegex = new RegExp("(?:https?://)?www\\.youtube\\.com/watch(?:\\?|&)v=([^\\s&]+)");

Meteor.methods({
    "album.add": function(name){
        check(name, AlphaNumericNonEmptyString);

        var conflictingAlbum = Perseid.colls.albums.findOne({name: name});
        if (conflictingAlbum) {
            throw new Meteor.Error(409, "Album " + name + " already exists");
        }

        var id = Perseid.colls.albums.insert({name: name});

        try {
            SmartFile.mkdir(id);
        } catch (e) {
            Perseid.colls.albums.remove({_id: id});
            throw new Meteor.Error(500, e.message);
        }
    },

    "album.embed.youtube": function(albumId, youtubeUrl){
        var match = ytRegex.exec(youtubeUrl);

        if (!match){
            throw new Meteor.Error(400, "Bad YouTube URL");
        }

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

        Perseid.colls.albums.prePhotoInsertCheck(albumId, ytPhoto);
        Perseid.colls.photos.insert(ytPhoto);
    }
});
