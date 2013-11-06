Perseid.subs.albums = Meteor.subscribe("albums");
Perseid.subs.albumsThumbs = Meteor.subscribe("albumsThumbs");

Router.map(function(){
    this.route("albumListPage", {
        path: "/",
        waitOn: Perseid.subs.albums
    });

    this.route("albumPage", {
        path:"/:_id",
        waitOn: function (){
            return [Perseid.subs.albums, Perseid.subs.photos];
        },
        before: function (){
            if (Perseid.subs.photos){
                Perseid.subs.photos.stop();
            }
            Perseid.subs.photos = Meteor.subscribe("photos", this.params._id);
        },
        data: function(){
            return Perseid.colls.albums.findOne({_id: this.params._id});
        }
    });
});