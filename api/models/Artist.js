'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema= Schema({
	image:String,
	description:String,
	name:String
	,
	
});

module.exports = mongoose.model('Artist', ArtistSchema);