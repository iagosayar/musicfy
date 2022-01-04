'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app= express();

//cargar rutas


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var user_routes= require('./routes/user');
var artist_routes= require('./routes/artist');
//configurar cabeceras

//rutas base
app.use('/api', user_routes);
app.use('/api',artist_routes);

// app.get("/pruebas", function(req, res){
// 	res.status(200).send({message: "hola mundo"});
// });

module.exports=app;