'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema= Schema({
	name:String,
	descrption:String
	image:String
});
module.exports = mongoose.model('Artist', ArtistSchema);