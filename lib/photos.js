var Photos = new Meteor.Collection("photos");
Photos.sort = {date: 1};

Perseid.colls.photos = Photos;