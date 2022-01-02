
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://127.0.0.1:27017/curso_mean2',(err, res) => {
if(err){
    throw err;
  }else{
    console.log("La base de datos esta corriendo correctamente");

    app.listen(port,function(){
      console.log("Servidor de la api rest de musica escuchando en http://localhost:"+port);
    });
  }
});
