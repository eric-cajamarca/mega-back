'use strict'

var express = require('express');
var AdminController = require('../controllers/AdminController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

api.post('/login_admin',AdminController.login_admin);
api.get('/listar_etiquetas_admin',auth.auth,AdminController.listar_etiquetas_admin);
api.delete('/eliminar_etiqueta_admin/:id',auth.auth,AdminController.eliminar_etiqueta_admin);
api.post('/agregar_etiqueta_admin',auth.auth,AdminController.agregar_etiqueta_admin);
api.post('/registro_producto_admin',[auth.auth,path],AdminController.registro_producto_admin);
api.get('/listar_productos_admin',auth.auth,AdminController.listar_productos_admin);
api.get('/listar_variedades_productos_admin',auth.auth,AdminController.listar_variedades_productos_admin);

api.get('/obtener_producto_admin/:id',auth.auth,AdminController.obtener_producto_admin);

api.get('/listar_etiquetas_producto_admin/:id',auth.auth,AdminController.listar_etiquetas_producto_admin);
api.delete('/eliminar_etiqueta_producto_admin/:id',auth.auth,AdminController.eliminar_etiqueta_producto_admin);
api.post('/agregar_etiqueta_producto_admin',auth.auth,AdminController.agregar_etiqueta_producto_admin);
api.put('/actualizar_producto_admin/:id',[auth.auth,path],AdminController.actualizar_producto_admin);

//reviews
api.get('/obtener_reviews_producto_admin/:id?',auth.auth,AdminController.obtener_reviews_producto_admin);


api.get('/listar_variedades_admin/:id',auth.auth,AdminController.listar_variedades_admin);
api.put('/actualizar_producto_variedades_admin/:id',auth.auth,AdminController.actualizar_producto_variedades_admin);
api.delete('/eliminar_variedad_admin/:id',auth.auth,AdminController.eliminar_variedad_admin);
api.delete('/eliminar_producto_admin/:id',auth.auth,AdminController.eliminar_producto_admin);
api.post('/agregar_nueva_variedad_admin',auth.auth,AdminController.agregar_nueva_variedad_admin);

//inventario
api.get('/listar_inventario_producto_admin/:id',auth.auth,AdminController.listar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin',auth.auth,AdminController.registro_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id',auth.auth,AdminController.eliminar_inventario_producto_admin);

api.put('/agregar_imagen_galeria_admin/:id',[auth.auth,path],AdminController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id',auth.auth,AdminController.eliminar_imagen_galeria_admin);
api.get('/verificar_token',auth.auth,AdminController.verificar_token);
api.get('/cambiar_vs_producto_admin/:id/:estado',auth.auth,AdminController.cambiar_vs_producto_admin);

//reseña
api.get('/cambiar_vs_reviews_admin/:id/:estado',auth.auth,AdminController.cambiar_vs_reviews_admin);

api.get('/obtener_config_admin',AdminController.obtener_config_admin);
api.put('/actualizar_config_admin',auth.auth,AdminController.actualizar_config_admin);
api.post('/pedido_compra_cliente',auth.auth,AdminController.pedido_compra_cliente);

//categoria


api.get('/obtener_portada/:img',AdminController.obtener_portada);
api.get('/obtener_ventas_admin',auth.auth,AdminController.obtener_ventas_admin);
api.get('/obtener_detalles_ordenes_cliente/:id',auth.auth,AdminController.obtener_detalles_ordenes_cliente);
api.put('/marcar_finalizado_orden/:id',auth.auth,AdminController.marcar_finalizado_orden);
api.delete('/eliminar_orden_admin/:id',auth.auth,AdminController.eliminar_orden_admin);
api.put('/marcar_envio_orden/:id',auth.auth,AdminController.marcar_envio_orden);
api.put('/confirmar_pago_orden/:id',auth.auth,AdminController.confirmar_pago_orden);
api.post('/registro_compra_manual_cliente',auth.auth,AdminController.registro_compra_manual_cliente);


//mensajes
api.get('/obtener_mensajes_admin',auth.auth,AdminController.obtener_mensajes_admin);
api.put('/cerrar_mensaje_admin/:id',auth.auth,AdminController.cerrar_mensaje_admin);

api.get('/kpi_ganancias_mensuales_admin',auth.auth,AdminController.kpi_ganancias_mensuales_admin);

module.exports = api;