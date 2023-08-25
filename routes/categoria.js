'use strict'

var express = require('express');
var categoriaController = require('../controllers/categoriaController');


var api = express.Router();
var auth = require('../middlewares/authenticate');

//creo dos variables para guardar una imagen
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/configuraciones'});

api.post('/crear_categoria_admin',auth.auth,categoriaController.crear_categoria_admin);
api.put('/actualiza_categoria_admin/:id',[auth.auth,path],categoriaController.actualiza_categoria_admin);
api.get('/obtener_categoria_admin',auth.auth,categoriaController.obtener_categoria_admin);
api.get('/obtener_logo/:img',categoriaController.obtener_logo);
api.get('/listar_logo_categoria_publico',categoriaController.listar_logo_categoria_publico);
//categorias
api.put('/subir_portada_categoria/:id',[auth.auth,path],categoriaController.subir_portada_categoria);

api.get('/listar_categorias_publico',categoriaController.listar_categorias_publico);
api.get('/listar_id_categorias_publico/:id',categoriaController.listar_id_categorias_publico);

module.exports = api;