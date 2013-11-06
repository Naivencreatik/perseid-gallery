Template.uploadProgress.helpers({
    "completed": function() {
        return Perseid.colls.uploads.find({state: "completed"}).count();
    },
    "total": function() {
        return Perseid.colls.uploads.find({}).count();
    }
});