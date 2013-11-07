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
    'lib/gallery.js',
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
    'client/collections/photos.js',
    
    'client/i18n/fr.js',

    'client/styles/gallery.css',

    'client/vendor/packery.pkgd.js',
    'client/vendor/imagesloaded.pkgd.js',

    'client/views/admin/header.html',
    'client/views/admin/header.js',

    'client/views/album/album.html',
    'client/views/album/album.js',
    'client/views/album/list.html',
    'client/views/album/list.js',

    'client/views/photo/helpers.js',
    'client/views/photo/list.html',
    'client/views/photo/list.js',
    'client/views/photo/overlay.html',
    'client/views/photo/overlay.js'

  ], 'client');
});