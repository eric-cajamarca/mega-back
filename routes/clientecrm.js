var express = require('express');
var clientecrmController = require('../controllers/clientecrmController');
var auth = require('../middlewares/authenticate');

var api = express.Router();

api.post('/registro_cliente_crm_admin',auth.auth,clientecrmController.registro_cliente_crm_admin);
api.get('/validar_correo_verificacion/:token',clientecrmController.validar_correo_verificacion);
api.get('/listar_clientes_crm_admin/:filtro',auth.auth,clientecrmController.listar_clientes_crm_admin);
api.get('/obtener_datos_cliente_crm_admin/:id',auth.auth,clientecrmController.obtener_datos_cliente_crm_admin);
api.put('/editar_cliente_crm_admin/:id',auth.auth,clientecrmController.editar_cliente_crm_admin);

api.get('/listar_clientes_crm_modal_admin/:filtro',auth.auth,clientecrmController.listar_clientes_crm_modal_admin);
api.put('/cambiar_estado_cliente_crm_admin/:id',auth.auth,clientecrmController.cambiar_estado_cliente_crm_admin);
api.get('/generar_token_encuesta_admin/:matricula/:cliente',auth.auth,clientecrmController.generar_token_encuesta_admin);
api.post('/enviar_encuesta_admin',clientecrmController.enviar_encuesta_admin);

api.get('/obtener_encuesta_cliente_crm_admin/:id',auth.auth,clientecrmController.obtener_encuesta_cliente_crm_admin);

module.exports = api;
