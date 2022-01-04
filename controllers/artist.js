'use strict'

var path=require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist=require('../models/Artist');
var Album=require('../models/Album');
var Song=require('../models/Song');



function saveArtist(req,res) {
    var artist = new Artist();
    //crear objeto del artista
    var artist = new Artist();
    //asignar valores a cada uno de sus propriedades
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        //si da un error al guardar el artista
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                //si no ha llegado el artista guardado
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    });
}
//método para listar artistas
function getArtist(req, res) {
        var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        //si no llega un error
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe' });
            } else {
                res.status(200).send({ artist });
            }
        }
    });
}

function getArtists(req, res) {//mostraremos todos los artistas
    if (req.params.page) { //si no hay param page
        //recibira un parám en la url page
        var page = req.params.page;
    } else {
        var page = 1;
    }

    //indicar la cantidad de artistas que recibira por página
    var itemsPerPage = 5;

    //sacar todos los artistas, sortearlo por nombre
    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!artists) { //si no hay artistas
                res.status(404).send({ message: 'Artistas no encontrados' });
            } else {
                return res.status(200).send({
                    //total de páginas
                    total_items: total,
                
                    //los artistas
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdated)=>{
         if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'Artista no actualizado correctamente' });
            } else {
                res.status(200).send({ artist: artistUpdated });
            }
        }
    });
}
//método para borrar el artista
function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar el artista' });
        } else {
            if (!artistRemoved) {
                res.status(404).send({ message: 'El artista no ha sido eliminado' });
            } else {
                //console.log();
                res.status(200).send({ artistRemoved });

                //cuando se elimina un artista se elimina todos sus albums
                Album.find({ artist: artistRemoved.id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar el album' });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({ message: 'Error al eliminar el album' });
                        } else {
                            //cuando se elimina un album se elimina todas sus canciones
                            Song.find({ album: albumRemoved.id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error al eliminar la canción' });
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({ message: 'La canción no ha sido eliminada' });
                                    } else {
                                        res.status(200).send({ artist: artistRemoved });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

//método de cargar las imágenes
function uploadImage(req, res) {
    var artistId = req.params.id;
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
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                //si no llega los datos del usuario
                if (!artistUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario!' });
                } else { //sino
                    res.status(200).send({ artist: artistUpdated });
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
    var path_file = './uploads/artists/' + imageFile;

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
//exportamos los metodos que vayamos a utlizar fuera de este archivo
module.exports= {
getArtist,
saveArtist,
getArtist,//un solo artista
getArtists,//varios artistas 
updateArtist,
deleteArtist,
uploadImage,
getImageFile

};