
'use strict'

//cargar modulo de mongoose
var mongoose = require('mongoose');

//definimos una eschema, variable de la base de datos
//que se guarda en forma de objeto de tipo Schema en la bd
var Schema = mongoose.Schema;

//una objeto para el Schema del usuario
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

//para poder utilizar este objeto fuera del fichero hay que exportarlo
module.exports = mongoose.model('User', UserSchema);