'use strict'
//VARIABLES
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
//cargaos servicio para cargar el token
var jwt= require ('../services/jwt');


//FUNCIONES 

function pruebas(req, res){
    res.status(200).send({message: 'funcion /prueba para probar funcionaldad de controlador'});
 }
//creamos una funcion para la creacion de usuarios

function saveUser(req,res){
   var user = new User();

   var params= req.body;
   console.log(params);

   user.name = params.name;
   user.surname = params.surname;
   user.email = params.email;
   user.role ='ROLE_ADMIN';
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

/*buscaremos al usuario por su email y comprobaremos su contraseña
lo que hara que estos sean los campos necesarios para el login */

   //Buscamos usuario por su email
   User.findOne({email:email.toLowerCase()},(err,user)=>{
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

/*
SAVEUSER(req,res) => Esta funcion declaramos todos los atributos del usuario
segun los parametros que recibira la funcion, a su vez,
tambien encriptaremos la contraseña del usuario para 
almacenarla en la base de datos 
*/
module.exports = {
 	pruebas,
   saveUser,
   loginUser
 }; 