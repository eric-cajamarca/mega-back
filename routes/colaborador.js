'use strict'

var express = require('express');
var colaboradorController = require('../controllers/colaboradorController');


var api = express.Router();
var auth = require('../middlewares/authenticate');



api.post('/registro_colaborador_admin',auth.auth,colaboradorController.registro_colaborador_admin);
api.post('/login_admin_colaborador',colaboradorController.login_admin_colaborador);
api.get('/listar_colaboradores_admin',auth.auth,colaboradorController.listar_colaboradores_admin);

api.put('/cambiar_estado_colaborador_admin/:id',auth.auth,colaboradorController.cambiar_estado_colaborador_admin);
api.get('/obtener_datos_colaborador_admin/:id',auth.auth,colaboradorController.obtener_datos_colaborador_admin);
api.put('/editar_colaborador_admin/:id',auth.auth,colaboradorController.editar_colaborador_admin);

module.exports = api;