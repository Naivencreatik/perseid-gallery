Perseid.subscriptions = {};

Perseid.subscriptions.albums = Meteor.subscribe("albums");

Router.map(function(){
    this.route("albumList", {
        path: "/",
        waitOn: Perseid.subscriptions.albums
    });

    this.route("album", {
        path:"/:_id",
        waitOn: Perseid.subscriptions.albums,
        data: function(){
            return Perseid.collections.albums.findOne({_id: this.params._id});
        }
    });
});

Router.configure({
    layout: "layout"
});