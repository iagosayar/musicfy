'use strict'

//para acceder a las rutas y crear rutas
var express = require('express');
//cargar el controlador
var AlbumController = require('../controllers/album');
//hacer las funciones de get, push etc
var api = express.Router();
//cargar el middleware para restringir el acceso a usu no identificados
var md_auth = require('../middlewares/authenticated');
//método de cargar las imágenes
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' });

//crear una ruta de prueba
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;