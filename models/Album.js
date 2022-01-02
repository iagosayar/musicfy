'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema= Schema({
	title:String,
	description:String,
	year:Number,
	image:String,
	//guardamos id de otro objeto de la base de datos un artista en este caso
	artist:{ type : Schema.ObjectId, ref:'Artist'} /
});

moder.exports= mongoose.model('Album',AlbumSchema);