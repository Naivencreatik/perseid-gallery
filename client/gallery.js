Perseid.subs.albums = Meteor.subscribe("albums");
Perseid.subs.albumsThumbs = Meteor.subscribe("albumsThumbs");

Router.map(function() {
    this.route("albumList", {
        path: "/albums",
        waitOn: Perseid.subs.albums,
        after: function() {
            this.render("adminAlbumListActions", {to: "adminActions"});
        }
    });

    this.route("album", {
        path:"/albums/:_id",
        waitOn: function() {
            return [Perseid.subs.albums, Perseid.subs.photos];
        },
        before: function () {
            if (Perseid.subs.photos){
                Perseid.subs.photos.stop();
            }
            Perseid.subs.photos = Meteor.subscribe("photos", this.params._id);
        },
        after: function() {
            this.render("adminAlbumActions", {to: "adminActions"});
        },
        data: function() {
            return Perseid.colls.albums.findOne({_id: this.params._id});
        }
    });
});