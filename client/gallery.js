Gallery.subs.albums = Meteor.subscribe("albums");
Gallery.subs.albumsThumbs = Meteor.subscribe("albumsThumbs");

Router.map(function() {
    this.route("albumList", {
        path: "/albums",
        waitOn: Gallery.subs.albums,
        adminActionsTemplate: "adminAlbumListActions",
        adminStatusTemplate: "adminUploadProgress"
    });

    this.route("album", {
        path:"/albums/:_id",
        adminActionsTemplate: "adminAlbumActions",
        adminStatusTemplate: "adminUploadProgress",
        waitOn: function() {
            return [Gallery.subs.albums, Gallery.subs.photos];
        },
        before: function () {
            if (Gallery.subs.photos){
                Gallery.subs.photos.stop();
            }
            Gallery.subs.photos = Meteor.subscribe("photos", this.params._id);
        },
        data: function() {
            return Gallery.colls.albums.findOne({_id: this.params._id});
        }
    });
});