'use strict'

//incluir modulos para poder subir imágenes
var path = require('path');
var fs = require('fs');

//cargar módulo de paginación
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/Artist');
var Album = require('../models/Album');
var Song = require('../models/Song');

//método de guardar el album
function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en servidor' });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: 'No se ha guardado el album' });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    });
}


//crear método para sacar albums en la bd
function getAlbum(req, res) {
    var albumId = req.params.id;

    //con populate indicamos el paht del artist, devuelve todos los datos de artista
    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        //si no llega un error
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!album) {
                res.status(404).send({ message: 'El album no existe' });
            } else {
                res.status(200).send({ album });
            }
        }
    });

    //res.status(200).send({ message: 'Método de getAlbum' });
}



//método de sacar todos los albums
function getAlbums(req, res) {
    //tenemos que sacar todos los album de un artista
    var artistId = req.params.artist;

    if (!artistId) {
        //sacar todos los album de la bd
        var find = Album.find({}).sort('title');
    } else {
        //sacar todos los album de la bd según una condición
        var find = Album.find({ artist: artistId }).sort('year');
    }

    //popular los datos de artista, 
    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!albums) {
                res.status(404).send({ message: 'No se encuentra los albums' });
            } else {
                res.status(200).send({ albums });
            }
        }
    });
}

//método para actualizar el album
function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el album' });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: 'Album no actualizado correctamente' });
            } else {
                res.status(200).send({ album: albumUpdated });
            }
        }
    });
}

//método para borrar el album
function deleteAlbum(req, res) {
    var albumId = req.params.id;

    //cuando se elimina un artista se elimina todos sus albums
    //se puede hacer de esta manera 
    //Album.find({ artist: albumId }).remove((err, albumRemoved) => {
    //o se puede hacer asi...
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar el album' });
        } else {
            if (!albumRemoved) {
                res.status(404).send({ message: 'El album no ha sido eliminado' });
            } else {
                //cuando se elimina un album se elimina todas sus canciones
                Song.find({ album: albumRemoved.id }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar la canción' });
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({ message: 'La canción no ha sido eliminada' });
                        } else {
                            res.status(200).send({ album: albumRemoved });
                        }
                    }
                });
            }
        }
    });
}

//método de cargar las imágenes
function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'Imagen no subida...';

    if (req.files) {
        var file_path = req.files.image.path;
        //recortar el string que llega por path y dejar solo el nombre de la imagen
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        //sacar extención de la imágen
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //console.log(ext_split);

        //comprobar que el fichero tiene la extención correcta
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            //actualizar la imágen que hay el la bd del usu
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                //si no llega los datos del usuario
                if (!albumUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario!' });
                } else { //sino
                    res.status(200).send({ album: albumUpdated });
                }
            });
        } else {
            res.status(200).send({ message: 'Extenció de archivo no valido' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subida ningúna imágen' });
    }
}

//método para extraer la imágen del usuario
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;

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
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};