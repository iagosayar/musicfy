'use strict'

var express= require('express');
var ArtistController= require('../controllers/artist')
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart=require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artist'});
//get->consultar | post->guardar| put->actualizar|
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);//debermos indicar el id del usuario para saber que modificamos 
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);//el ? sirve para indicar que es posible tanto recibir ese dato como que esa parte de la url este vacia
api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);

api.post('/upload-image-artist/:id', [md_auth.ensureAuth,md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);



module.exports = api;