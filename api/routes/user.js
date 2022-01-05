'user strict'

var express= require('express');
var UserController = require("../controllers/user");
var api= express.Router();
//cargamos el middleware en una variable
var md_auth=require('../middlewares/authenticated');
//multiparty nos permitirar subir ficheros mediante protocolo http
var multipart=require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

//el middleware debera cargarse en una variable y pasarse como 2º parametro 
api.get('/probando-controlador',md_auth.ensureAuth ,UserController.pruebas);

api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);

api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.get('/get-image-user/:imageFile',UserController.getImageFile);


module.exports= api;