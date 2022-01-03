'user strict'

var express= require('express');
var UserController = require("../controllers/user");

var api= express.Router();
//cargamos el middleware en una variable
var md_auth=require('../middlewares/authenticated');
//el middleware debera cargarse en una variable y pasarse como 2º parametro 
api.get('/probando-controlador',md_auth.ensureAuth ,UserController.pruebas);

api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
module.exports= api;