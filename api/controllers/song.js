'use strict'
'use strict'

//incluir modulos para poder subir imágenes
var path = require('path');
var fs = require('fs');

//cargar módulo de paginación
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/Artist');
var Album = require('../models/Album');
var Song = require('../models/Song');

//método para ver la canción
function getSong(req, res) {
    var songId = req.params.id;

    //con populate indicamos el paht del artist, devuelve todos los datos de artista
    Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
        //si no llega un error
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!song) {
                res.status(404).send({ message: 'La canción no existe' });
            } else {
                res.status(200).send({ song });
            }
        }
    });
}

//método de sacar todos las cancioens
function getSongs(req, res) {
    //tenemos que sacar todos los album de un artista
    var albumId = req.params.artist;

    if (!albumId) {
        //sacar todos los album de la bd
        var find = Song.find({}).sort('number');
    } else {
        //sacar todos los album de la bd según una condición
        var find = Song.find({ album: albumId }).sort('number');
    }

    //popular los datos de albums, 
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function(err, songs) {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!songs) {
                res.status(404).send({ message: 'No hay canciones' });
            } else {
                res.status(200).send({ songs });
            }
        }
    });
}

//método de guardar la canción
function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en servidor' });
        } else {
            if (!songStored) {
                res.status(404).send({ message: 'No se ha guardado la canción' });
            } else {
                res.status(200).send({ song: songStored });
            }
        }
    });
}

//método para actualizar la canción
function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar la canción' });
        } else {
            if (!songUpdate) {
                res.status(404).send({ message: 'Canción no actualizada correctamente' });
            } else {
                res.status(200).send({ song: songUpdate });
            }
        }
    });
}

//método para borrar la canción
function deleteSong(req, res) {
    var songId = req.params.id;

    //cuando se elimina un artista se elimina todos sus albums
    //se puede hacer de esta manera 
    //Album.find({ artist: albumId }).remove((err, albumRemoved) => {
    //o se puede hacer asi...
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar la canción' });
        } else {
            if (!songRemoved) {
                res.status(404).send({ message: 'La canción no ha sido eliminada' });
            } else {
                res.status(200).send({ song: songRemoved });
            }
        }
    });
}

//método de cargar las canciones
function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'Canción no subida...';

    if (req.files) {
        var file_path = req.files.file.path;
        //recortar el string que llega por path y dejar solo el nombre de la imagen
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        //sacar extención de la imágen
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //console.log(ext_split);

        //comprobar que el fichero tiene la extención correcta
        if (file_ext == 'mp3' || file_ext == 'ogg') {
            //actualizar la imágen que hay el la bd del usu
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                //si no llega los datos del usuario
                if (!songUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar la canción!' });
                } else { //sino
                    res.status(200).send({ song: songUpdated });
                }
            });
        } else {
            res.status(200).send({ message: 'Extenció de archivo no valido' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subida ningúna canción' });
    }
}

//método para extraer la imágen del usuario
function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function(exists) {
        //si la imágen existe
        if (exists) {
            //respuesta que manda un fichero
            res.sendFile(path.resolve(path_file));
        } else { //sino
            res.status(200).send({ message: 'No existe la canción' });
        }
    });
}

module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};