/*
Los Middleware se ejecutan antes de ejecutar la accion vinculada 
a una ruta es decir se ejecutara antes de cada ruta y en este 
caso comprobaremos si el usuario esta loggeado
*/

'use strict'

var jwt = require ('jwt-simple');
var moment = require('moment');
var secret ='clave_secreta_curso';

exports.ensureAuth =function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message:'la peticion no tiene la cabecera de autenticacion'});
	}
	//quitamos las comillas del toquen con este comando
	var token = req.headers.authorization.replace(/['"]+/g,'');
	try{
		var payload = jwt.decode(token,secret);
		if(payload.exp<=moment.unix){
			return res.status(401).send({message:'Token ha expirado'});
		}
	}catch(ex){
		console.log(ex);
		return res.status(404).send({message:'Token no valido'});
		
	}
	req.user = payload;
	next();
}