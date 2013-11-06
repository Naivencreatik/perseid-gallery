Package.describe({
  summary: "Meteor modular CMS - Gallery component"
});

Package.on_use(function (api) {
  api.use([
    'perseid',
  ], ['client', 'server']);

  api.use([
    'imagemagick',
  ], ['server']);

  api.add_files([
    'collections/albums.js',
    'collections/photos.js'
  ], ['client', 'server']);

  api.add_files([
    'server/methods.js',
    'server/publications.js',
    'server/uploader.js'
  ], 'server');

  api.add_files([
    'client/gallery.js',
    
    'client/collections/albums.js',

    'client/styles/main.css',

    'client/vendor/packery.pkgd.js',
    'client/vendor/imagesloaded.pkgd.js',

    'client/views/album/add.html',
    'client/views/album/add.js',
    'client/views/album/album.html',
    'client/views/album/album.js',
    'client/views/album/list.html',
    'client/views/album/list.js',

    'client/views/photo/add.html',
    'client/views/photo/add.js',
    'client/views/photo/helpers.js',
    'client/views/photo/list.html',
    'client/views/photo/list.js',
    'client/views/photo/overlay.html',
    'client/views/photo/overlay.js',

    'client/views/upload/upload.html',
    'client/views/upload/upload.js'

  ], 'client');
});