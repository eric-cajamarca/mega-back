'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetalleInventarioSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    variedad: {type: Schema.ObjectId, ref: 'variedad', required: true},
    cantidad: {type: Number, require: true},
    admin: {type: Schema.ObjectId, ref: 'admin', required: true},
    proveedor: {type: String, require: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('detalleinventario',DetalleInventarioSchema);