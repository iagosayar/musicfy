'user strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret= 'clave_secreta_curso';

/*creamos un token con el objeto user dentro, 
de esta manera podremos comprobar los datos del usuario en todo momento
sabiendo tambien si esta loggeado o no
 */
exports.createTokem= function(user){

var payload = {
sub: user._id,
name:user.name,
surname:user.surname,
email:user.email,
role : user.role,
imagen: user.image,
iat: moment().unix(), //fecha de creacion del token timestamp format
exp:moment().add(30,'days').unix()
};
//devolver token codificado
//payload => objeto objeto del usuario identificado(datos dentro de token)
//secret => el hash se crea entorno a la clave secret 
return jwt.encode(payload,secret);
}