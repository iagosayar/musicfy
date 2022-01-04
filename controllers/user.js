'use strict'
//VARIABLES
var fs = require('fs');
var path= require ('path');
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');
//cargaos servicio para cargar el token
var jwt= require ('../services/jwt');


//FUNCIONES 

function pruebas(req, res){
    res.status(200).send({message: 'funcion /prueba para probar funcionaldad de controlador'});
 }
//creamos una funcion para la creacion de usuarios

function saveUser(req,res){
/*
SAVEUSER(req,res) => Esta funcion declaramos todos los atributos del usuario
segun los parametros que recibira la funcion, a su vez,
tambien encriptaremos la contraseña del usuario para 
almacenarla en la base de datos 
*/
   var user = new User();

   var params= req.body;
   console.log(params);

   user.name = params.name;
   user.surname = params.surname;
   user.email = params.email;
   user.role ='ROLE_USER';
 //user.role ='ROLE_ADMIN';
   user.image = 'null';

   
   if(params.password){
      //aqui encriptamos y guardamos datos
      bCrypt.hash(params.password,null,null,function(err,hash){
      user.password=hash;
         /*comprobamos si todos los campos aparte de la password 
         han sido rellenados*/
         if(user.name!=null && user.surname!=null && user.email!=null){
            //guardar usuario
            user.save((err,userStored)=>{
               //comprobamos si el usuario se guarda correctamente o recibimos un error
               if (err) {
                  //status 500 indica que ha habido un error
                  res.status(500).send({message:'Error al guardar usuario'});
               }else{
                     if(!userStored){
                        //comprobamos si el usuario ha sido guardado
                         res.status(404).send({message:'No se ha registrado correctamente el usuario'});
                        //si no existe userStored sacamos el mensage pertiente con error 404
                     }else{
                        //devolvemos un objeto con todos los datos de usuario
                         res.status(200).send({user: userStored});
                     }
               }
            });
         }else{
                res.status(200).send({message: "Rellena todos los campos"});
         }
      });

   }else{
      res.status(500).send({message:'Introduce la contraseña'});

   }
 }

/*recogeremos los parametros recibidos por post,comprobaremos mediante
  findOne() si existe en la base de datos, y comparar com bcrypt la password.
 */

function loginUser(req,res){
   var params= req.body;

   var email=params.email;
   var password = params.password;

   //buscaremos al usuario por su email y comprobaremos su contraseña
   //lo que hara que estos sean los campos necesarios para el login */

   //Buscamos usuario por su email
   User.findOne({email: email.toLowerCase()},(err,user)=>{
      if(err){

      res.status(500).send({message:'error en la peticion'});

      }else{
         //email como clave
         if(!user){
            //si usuario(email) no existe devolvemos mensaje
         res.status(404).send({message:'usuario no existe'});
         }else{

            //si usuario(email) existe en bd comparamos contraseñas con bCrypt
            bCrypt.compare(password,user.password,function(err,check){
               //devuelve check si coinciden las contraseñas 
               if(check){
                  //devolveremos los datos de usuario logeado
                  if(params.gethash){
                     /*esta funcion devolvera un token que comprobaremos en la api 
                       para saber si el usuario esta loggeado 
                        */
                        //ya hemos creado el token en jwt.js ahora trabajamos con el
                          res.status(200).send({
                              token: jwt.createTokem(user)
                           });


                  }else{
                     //
                     res.status(200).send({user});
                  }
               }else{
                   res.status(404).send({message:'Email o contraseña incorrectos'});
               }
            });

         }

      }
   });
}

function updateUser(req,res){
   var userId= req.params.id;
   var update = req.body;

   User.findByIdAndUpdate(userId, update, (err,userUpdated)=>{
     console.log(userUpdated);
     console.log('lo variamos');

      if(err){
         res.status(500).send({message:'Eror al actualizar el usuario'});
      }else{
         if(!userUpdated){
              res.status(404).send({message:'Eror al actualizar el usuario'});
         }else{
              res.status(200).send({user: userUpdated});
     

         }
      }
      //FUNCIONA PERO MUESTRA ANTES DE REALIZAR LA EDICION USUARIO
   });

}
function uploadImage(req, res){

   var userId = req.params.id;
   var file_name="No subido.. .";
   //console.log(req.file);
   if(req.files){
      var file_path= req.files.image.path;
      //dividimos el path en una coleccion seleccionando cada rama de la ruta (cada vez que \)
      var file_split = file_path.split('\\');
      //seleccionamos la ultima posicion que seria el nombre del archivo
      var file_name =  file_split[2];
      var ext_split = file_name.split('\.');
      var file_ext=ext_split[1];

 
      if(file_ext=='png' || file_ext=='gif'|| file_ext=='jpg'){
            //id a buscar ,nombre del archivo, funcion callback(podemos recibir erro o userUpdated(recibimos esto al accion correcta ))
        User.findByIdAndUpdate(userId, {image: file_name}, (err,userUpdated)=>{
               if(!userUpdated){
                  res.status(404).send({message:'No se ha podido actualizar el usuario'});
               }else{
                  res.status(200).send({image:file_name, user: userUpdated});
               }
         });//findByIdAndUpdate
      }else{
         res.status(404).send({message:'Extension del archivo no valida'});
      }//endif File

      console.log(file_path);
   }else{
      res.status(200).send({message:'No has subido ninguna imagen'});
   }//endif(req.files) 
}



//método para extraer la imágen del usuario
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists) {
        //si la imágen existe
        if (exists) {
            //respuesta que manda un fichero
            res.sendFile(path.resolve(path_file));
        } else { //sino
            res.status(200).send({ message: 'No existe la imágen' });
        }
    });
}
module.exports = {
 	pruebas,
   saveUser,
   loginUser,
   updateUser,
   uploadImage,
   getImageFile
 }; 