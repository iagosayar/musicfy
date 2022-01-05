'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app= express();

//cargar rutas


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var user_routes= require('./routes/user');
var artist_routes= require('./routes/artist');
var album_routes= require('./routes/album');
var song_routes= require('./routes/song');
//configurar cabeceras
app.use((req, res, next) => {
    //configurar cabecera
    //para permitir el acceso a nuestra api de todos los dominios
    res.header('Access-Control-Allow-Origin', '*');
    //cabeceras necesarias para AJAX
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    //para salir del flujo y seguir
    next();
});

//use rutas 
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api',song_routes);
// app.get("/pruebas", function(req, res){
// 	res.status(200).send({message: "hola mundo"});
// });

module.exports=app;