var ytRegex = new RegExp("(?:https?://)?www\\.youtube\\.com/watch(?:\\?|&)v=([^\\s&]+)");

Meteor.methods({
    "album.add": function(name){
        Perseid.checkUserId(this.userId);
        check(name, Perseid.match.AlphaNumericNonEmptyString);

        var album = {name: name};
        Perseid.colls.photos.conflictCheck(album);

        var id = Perseid.colls.albums.insert(album);
        try {
            SmartFile.mkdir(id);
        } catch (e) {
            Perseid.colls.albums.remove({_id: id});
            throw new Meteor.Error(500, e.message);
        }
    },

    "photo.add.youtube": function(albumId, youtubeUrl){
        Perseid.checkUserId(this.userId);

        var match = ytRegex.exec(youtubeUrl);
        if (!match){
            throw new Meteor.Error(400, "Bad YouTube URL");
        }

        Perseid.colls.albums.existenceCheck(albumId);

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

        Perseid.colls.photos.conflictCheck(ytPhoto);
        Perseid.colls.photos.insert(ytPhoto);
    },

    "photo.delete": function(id) {
        Perseid.checkUserId(this.userId);

        var photo = Perseid.colls.photos.existenceCheck(id);

        if (photo.type !== "youtube"){
            //TODO: smartfile!
        }

        Perseid.colls.photos.remove({_id: id});
    }
});
