var Admin = require('../models/Admin');
var Config = require('../models/Config');
var Etiqueta = require('../models/Etiqueta');
var Variedad = require('../models/Variedad');
var Inventario = require('../models/Inventario');
var Producto = require('../models/Producto');
var Producto_etiqueta = require('../models/Producto_etiqueta');
var Contacto = require('../models/Contacto');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Venta = require('../models/Venta');
var Dventa = require('../models/Dventa');
var Carrito = require('../models/Carrito');
var Review = require('../models/Review');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
// var categoria = require('/')

const login_admin = async function(req,res){
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email:data.email});
    
    if(admin_arr.length == 0){
        res.status(200).send({message: 'El correo electrónico no existe', data: undefined});
    }else{
        //LOGIN
        let user = admin_arr[0];
        
        bcrypt.compare(data.password, user.password, async function(error,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                    
                });
                
            }else{
                res.status(200).send({message: 'Las credenciales no coinciden', data: undefined}); 
            }
        });
 
    } 
}

const listar_etiquetas_admin = async function(req,res){
    if(req.user){
        var reg = await Etiqueta.find();
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_etiqueta_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let reg = await Etiqueta.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_etiqueta_admin = async function(req,res){
    if(req.user){
        try {
            let data = req.body;

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');;
            var reg = await Etiqueta.create(data);
            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined,message:'Etiqueta ya existente'});
            
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_producto_admin = async function(req,res){
    
    if(req.user){
        let data = req.body;

        let productos = await Producto.find({titulo:data.titulo});
        
        let arr_etiquetas = JSON.parse(data.etiquetas);

        if(productos.length == 0){
            var img_path = req.files.portada.path;
            var name = img_path.split('/');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            data.portada = portada_name;
            let reg = await Producto.create(data);

            if(arr_etiquetas.length >= 1){
                for(var item of arr_etiquetas){
                    await Producto_etiqueta.create({
                        etiqueta: item.etiqueta,
                        producto: reg._id,
                    });
                }
            }

            res.status(200).send({data:reg});
        }else{
            res.status(200).send({data:undefined, message: 'El título del producto ya existe'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_productos_admin = async function(req,res){
    if(req.user){
        var productos = await Producto.find();
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const listar_variedades_productos_admin = async function(req,res){
    if(req.user){
        var productos = await Variedad.find().populate('producto');
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const obtener_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        console.log('aqui entro a obtener_producto_admin');
        try {
            var reg = await Producto.findById({_id:id});
            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

// const listar_usuario_admin = async function(req,res){
//     if(req.user){
//         console.log('aqui imprimo el id del user');    
//         console.log(req.user);

//         var id = req.params['id'];

//         console.log('aqui imprimo el id del admin');    
//         console.log(id);
        
//         var reg = await Inventario.find({admin: id}).populate('admin').sort({createdAt:-1});
//         res.status(200).send({data:reg});
        
//     }else{
//         res.status(500).send({message: 'NoAccess'});
//     }
// }

const listar_etiquetas_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var etiquetas = await Producto_etiqueta.find({producto:id}).populate('etiqueta');
        res.status(200).send({data:etiquetas});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_etiqueta_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        // console.log(id);
        let reg = await Producto_etiqueta.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_etiqueta_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;

        var reg = await Producto_etiqueta.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_portada = async function(req,res){
    var img = req.params['img'];


    fs.stat('./uploads/productos/'+img, function(err){
        if(!err){
            let path_img = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const actualizar_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;

        if(req.files){
            //SI HAY IMAGEN
            var img_path = req.files.portada.path;
            var name = img_path.split('/');
            var portada_name = name[2];

            let reg = await Producto.findByIdAndUpdate({_id:id},{
                titulo: data.titulo,
                stock: data.stock,
                precio_antes_soles: data.precio_antes_soles,
                precio_antes_dolares: data.precio_antes_dolares,
                precio: data.precio,
                precio_dolar: data.precio_dolar,
                peso: data.peso,
                sku: data.sku,
                categoria: data.categoria,
                visibilidad: data.visibilidad,
                descripcion: data.descripcion,
                contenido:data.contenido,
                portada: portada_name
            });

            fs.stat('./uploads/productos/'+reg.portada, function(err){
                if(!err){
                    fs.unlink('./uploads/productos/'+reg.portada, (err)=>{
                        if(err) throw err;
                    });
                }
            })

            res.status(200).send({data:reg});
        }else{
            //NO HAY IMAGEN
           let reg = await Producto.findByIdAndUpdate({_id:id},{
               titulo: data.titulo,
               stock: data.stock,
               precio_antes_soles: data.precio_antes_soles,
                precio_antes_dolares: data.precio_antes_dolares,
               precio: data.precio,
               precio_dolar: data.precio_dolar,
                peso: data.peso,
                sku: data.sku,
               categoria: data.categoria,
               visibilidad: data.visibilidad,
               descripcion: data.descripcion,
               contenido:data.contenido,
           });
           res.status(200).send({data:reg});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_variedades_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let data = await Variedad.find({producto:id});
        res.status(200).send({data:data});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_producto_variedades_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;

        console.log(data.titulo_variedad);
        let reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo_variedad: data.titulo_variedad,
        });
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_variedad_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let reg = await Variedad.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_nueva_variedad_admin = async function(req,res){
    if(req.user){
        var data = req.body;

        console.log(data);
        let reg = await Variedad.create(data);

        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


// const listar_inventario_producto_admin = async function(req,res){
//     if(req.user){
//         var id = req.params['id'];

//         var reg = await Inventario.find({producto: id}).populate('variedad').sort({createdAt:-1});
//         var usuarioAdmin = await Inventario.find({producto: id}).populate('admin').sort({createdAt:-1});
//         res.status(200).send({data:reg});
//     }else{
//         res.status(500).send({message: 'NoAccess'});
//     }
// }
const listar_inventario_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        
        console.log('aqui imprimo el id');
        console.log(id);

        //aqui extraigo las colecciones de variedad y admin con populate
        var reg = await Inventario.find({producto: id})
        .populate('variedad').sort({createdAt:-1})
        .populate('admin');

        // var usuarioAdmin = await Inventario.find({producto: id}).populate('admin').sort({createdAt:-1});
        console.log('aqui imprimo el usuario admin');
        console.log(reg);
        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_inventario_producto_admin = async function(req,res){
    if(req.user){
        
        //OBTENER ID DEL INVENTARIO
        var id = req.params['id'];

        //ELIMINAR INVENTARIO
        let reg = await Inventario.findByIdAndRemove({_id:id});
        
        //OBTENER EL REGISTRO DE PRODUCTO
        let prod = await Producto.findById({_id:reg.producto});

        //CALCULAR EL NUEVO STOCK
        let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

        //ACTUALICACION DEL NUEVO STOCK AL PRODUCTO
        let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
        stock: nuevo_stock
        })

           res.status(200).send({data:producto});
            
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_inventario_producto_admin = async function(req,res){
    
    if(req.user){
        let data = req.body;

        let reg = await Inventario.create(data);
        console.log(reg);

        //OBTENER EL REGISTRO DE PRODUCTO
        let prod = await Producto.findById({_id:reg.producto});
        console.log(prod);


        let varie = await Variedad.findById({_id:reg.variedad});
        console.log(varie);


        //CALCULAR EL NUEVO STOCK        
                            //STOCK ACTUAL         //STOCK A AUMENTAR
        let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

        //CALCULA ES STOCK DE LAS VARIEDADES CUANDO SE REALIZA UNA VENTA
        let nuevo_stock_vari = parseInt(varie.stock) + parseInt(reg.cantidad);

        //ACTUALICACION DEL NUEVO STOCK AL PRODUCTO
        let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
            stock: nuevo_stock
        });

        let variedad = await Variedad.findByIdAndUpdate({_id:reg.variedad},{
            stock: nuevo_stock_vari
        });

        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_imagen_galeria_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
            let data = req.body;

            var img_path = req.files.imagen.path;
            var name = img_path.split('/');
            var imagen_name = name[2];

            let reg =await Producto.findByIdAndUpdate({_id:id},{ $push: {galeria:{
                imagen: imagen_name,
                _id: data._id
            }}});

            res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_imagen_galeria_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;


        let reg =await Producto.findByIdAndUpdate({_id:id},{$pull: {galeria: {_id:data._id}}});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const verificar_token = async function(req,res){
    console.log(req.user);
    if(req.user){
        res.status(200).send({data:req.user});
    }else{
        console.log(2);
        res.status(500).send({message: 'NoAccess'});
    } 
}

const cambiar_vs_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var estado = req.params['estado'];

        // console.log('aqui imprimo el estado');
        // console.log(estado);

        try {
            if(estado == 'Edicion'){
                await Producto.findByIdAndUpdate({_id:id},{estado:'Publicado'});
                res.status(200).send({data:true});
            }else if(estado == 'Publicado'){
                await Producto.findByIdAndUpdate({_id:id},{estado:'Edicion'});
                res.status(200).send({data:true});
            }
        } catch (error) {
            res.status(200).send({data:undefined});
        }
        
     }else{
         res.status(500).send({message: 'NoAccess'});
     }
}

//cambiar estado de reseñas
const cambiar_vs_reviews_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var estado = req.params['estado'];

        console.log('aqui imprimo el estado');
        console.log(estado);
        console.log(id);

        try {
            if(estado == 'Activo'){
                await Review.findByIdAndUpdate({_id:id},{estado:'Inactivo'});
                res.status(200).send({data:true});
            }else if(estado == 'Inactivo'){
                await Review.findByIdAndUpdate({_id:id},{estado:'Activo'});
                res.status(200).send({data:true});
            }
        } catch (error) {
            res.status(200).send({data:undefined});
        }
        
     }else{
         res.status(500).send({message: 'NoAccess'});
     }
}

const obtener_config_admin = async (req,res)=>{
    let config = await Config.findById({_id:'61abe55d2dce63583086f108'});
    res.status(200).send({data:config});
}

const actualizar_config_admin = async (req,res)=>{
    if(req.user){
        let data = req.body;
        let config = await Config.findByIdAndUpdate({_id:'61abe55d2dce63583086f108'},{
            envio_activacion : data.envio_activacion,
            monto_min_soles: data.monto_min_soles,
            monto_min_dolares : data.monto_min_dolares
        });
        res.status(200).send({data:config});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

const pedido_compra_cliente = async function(req,res){
    if(req.user){
        try {
            var data = req.body;
            var detalles = data.detalles;
            let access = false;
            let producto_sl = '';

            for(var item of detalles){
                let variedad = await Variedad.findById({_id:item.variedad}).populate('producto');
                if(variedad.stock < item.cantidad){
                    access = true;
                    producto_sl = variedad.producto.titulo;
                }
            }

            if(!access){
                data.estado = 'En espera';
                let venta = await Venta.create(data);
        
                for(var element of detalles){
                    element.venta = venta._id;
                    await Dventa.create(element);
                    await Carrito.remove({cliente:data.cliente});
                }
                enviar_email_pedido_compra(venta._id);
                res.status(200).send({venta:venta});
            }else{
                res.status(200).send({venta:undefined,message:'Stock insuficiente para ' + producto_sl});
            }
        } catch (error) {
            console.log(error);
        }

        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

//enviar correo del perdido
const enviar_email_pedido_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'ventasecomallki@gmail.com',
                pass: 'oknserherndzkrfy'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_pedido.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'ventasecomallki@gmail.com',
                to: orden.cliente.email,
                subject: 'Gracias por tu orden, EcoMalki.',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 

const obtener_ventas_admin  = async function(req,res){
    if(req.user){
        let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];

            ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});
            res.status(200).send({data:ventas});

            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({venta:venta._id}).populate('producto').populate('variedad');
            res.status(200).send({data:venta,detalles:detalles});

        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined});
        }
        
        
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const marcar_finalizado_orden = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Finalizado'
        });

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_orden_admin = async function(req,res){
    if(req.user){

        var id = req.params['id'];

        var venta = await Venta.findOneAndRemove({_id:id});
        await Dventa.remove({venta:id});

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const marcar_envio_orden = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            tracking: data.tracking,
            estado: 'Enviado'
        });

        mail_confirmar_envio(id);

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const confirmar_pago_orden = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Procesando'
        });

        var detalles = await Dventa.find({venta:id});
        for(var element of detalles){
            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });
        }

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const mail_confirmar_envio = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'ventasecomallki@gmail.com',
                pass: 'oknserherndzkrfy'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_enviado.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'ventasecomallki@gmail.com',
                to: orden.cliente.email,
                subject: 'Tu pedido ' + orden._id + ' fué enviado',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 

const registro_compra_manual_cliente = async function(req,res){
    if(req.user){

        var data = req.body;
        var detalles = data.detalles;

        data.estado = 'Procesando';
        
        console.log(data);

        let venta = await Venta.create(data);

        for(var element of detalles){
            element.venta = venta._id;
            element.cliente = venta.cliente;
            await Dventa.create(element);

            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });
        }

        enviar_orden_compra(venta._id);

        res.status(200).send({venta:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const enviar_orden_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'ventasecomallki@gmail.com',
                pass: 'oknserherndzkrfy'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_compra.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'ventasecomallki@gmail.com',
                to: orden.cliente.email,
                subject: 'Confirmación de compra ' + orden._id,
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
     
}


const eliminar_producto_admin = async function(req,res){
    if(req.user){
        
      try {
        const id = req.params['id'];
        console.log('imprimo el id');
        console.log(id);
        const variedad= await Variedad.findOneAndRemove({producto:id});
        const inventario = await Inventario.findOneAndRemove({producto:id});
        const prod_etiqueta = await Producto_etiqueta.findOneAndRemove({producto:id});
        let reg = await Producto.findOneAndRemove({_id:id});
        res.status(200).send({data:reg});
        console.log(reg);
      } catch (error) {
        res.status(500).send({message: error});
        console.log(error);
      }      
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }

}

//mensajes
const obtener_mensajes_admin  = async function(req,res){
    if(req.user){
            
        let reg = await Contacto.find().sort({createdAt:-1});

        console.log('aqui veo que regresa de contactos');
        console.log(reg);
        res.status(200).send({data:reg});

        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const cerrar_mensaje_admin  = async function(req,res){
    if(req.user){
        

        let id = req.params['id'];

        let reg = await Contacto.findByIdAndUpdate({_id:id},{estado: 'Cerrado'});
        res.status(200).send({data:reg});

        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


//KPI

const kpi_ganancias_mensuales_admin  = async function(req,res){
    if(req.user){
        // if(req.user.role == 'admin'){
           var enero = 0;
           var febrero = 0;
           var marzo = 0;
           var abril = 0;
           var mayo = 0;
           var junio = 0;
           var julio = 0;
           var agosto = 0;
           var septiembre = 0;
           var octubre = 0;
           var noviembre = 0;
           var diciembre = 0;

           var total_ganancia = 0;
           var total_mes = 0;
           var count_ventas = 0;
           var total_mes_anterior = 0;
           var yape_plin = 0;
           var deposito = 0;
           var tarjeta = 0;
           var paypal = 0;
           var total_yape_plin = 0;
           var total_deposito = 0;
           var total_tarjeta = 0;
           var total_paypal = 0;
           var cant_soles = 0;
           var cant_dolares = 0;
           var total_soles = 0;
           var total_dolares = 0;



           var reg = await Venta.find();
           let current_date = new Date();
           let current_year = current_date.getFullYear();
           let current_month = current_date.getMonth()+1;


            console.log('aqui reviso el reg de kpi');
            console.log(reg);


           for(var item of reg){
               let createdAt_date = new Date(item.createdAt);
               let mes = createdAt_date.getMonth()+1;

               if(createdAt_date.getFullYear() == current_year){

                    total_ganancia = total_ganancia + item.subtotal;

                    if(mes == current_month){
                        total_mes = total_mes + item.subtotal;
                        count_ventas = count_ventas + 1;
                    }

                    if(mes == current_month -1 ){
                        total_mes_anterior = total_mes_anterior + item.subtotal;
                    }

                   if(mes == 1){
                    enero = enero + item.subtotal;
                   }else if(mes == 2){
                    febrero = febrero + item.subtotal;
                   }else if(mes == 3){
                    marzo = marzo + item.subtotal;
                   }else if(mes == 4){
                    abril = abril + item.subtotal;
                   }else if(mes == 5){
                    mayo = mayo + item.subtotal;
                   }else if(mes == 6){
                    junio = junio + item.subtotal;
                   }else if(mes == 7){
                    julio = julio + item.subtotal;
                   }else if(mes == 8){
                    agosto = agosto + item.subtotal;
                   }else if(mes == 9){
                    septiembre = septiembre + item.subtotal;
                   }else if(mes == 10){
                    octubre = octubre + item.subtotal;
                   }else if(mes == 11){
                    noviembre = noviembre + item.subtotal;
                   }else if(mes == 12){
                    diciembre = diciembre + item.subtotal;
                   }
               }
               
               if(item.metodo_pago == 'Yape o Plin'){
                yape_plin = yape_plin + 1
                total_yape_plin = total_yape_plin + item.subtotal;
               }

               if(item.metodo_pago == 'Tarjeta de crédito'){
                tarjeta = tarjeta + 1
                total_tarjeta = total_tarjeta + item.subtotal;
               }

               if(item.metodo_pago == 'Transferencia o Deposito'){
                deposito = deposito + 1
                total_deposito = total_deposito + item.subtotal;
               }

               if(item.metodo_pago == 'Paypal'){
                paypal = paypal + 1
                total_paypal = total_paypal + item.subtotal;
               }

               if(item.currency == 'PEN'){
                    cant_soles = cant_soles + 1
                    total_soles = total_soles + item.subtotal;
                }
                else{
                    cant_dolares = cant_dolares + 1
                    total_dolares = total_dolares + item.subtotal;
                }
               

               

           }

          res.status(200).send({
              enero:enero,
              febrero:febrero,
              marzo:marzo,
              abril:abril,
              mayo:mayo,
              junio:junio,
              julio:julio,
              agosto:agosto,
              septiembre:septiembre,
              octubre:octubre,
              noviembre:noviembre,
              diciembre:diciembre,
              total_ganancia:total_ganancia,
              total_mes: total_mes,
              count_ventas:count_ventas,
              total_mes_anterior: total_mes_anterior,
              yape_plin:yape_plin,
              tarjeta:tarjeta,
              deposito:deposito,
              paypal:paypal,
              total_yape_plin:total_yape_plin,
              total_tarjeta:total_tarjeta,
              total_deposito:total_deposito,
              total_paypal:total_paypal,
              cant_soles:cant_soles,
              total_soles:total_soles,
              cant_dolares:cant_dolares,
              total_dolares:total_dolares
          })
            
        // }else{
        //     res.status(500).send({message: 'NoAccess'});
        // }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const obtener_reviews_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
       

        try {
            if(id=='all'){
                //código para mostrar solo las reviws todos los productos
                let reviews = await Review.find().populate('cliente').populate('producto').sort({createdAt:-1});
                res.status(200).send({data: reviews});
            }

            if(id){
                // Código que puede lanzar un error
                let reviews = await Review.find({producto:id}).populate('cliente').populate('producto').sort({createdAt:-1});
                res.status(200).send({data: reviews});
            }
            
            
          } catch (error) {
            
            // Manejar el error
            console.error(error);
            
        }

        // //código para mostrar solo las reviws todos los productos
        //   let reviews = await Review.find().populate('cliente').populate('producto').sort({createdAt:-1});
        //   console.log('aqui obtengo el id del productos que voy a buscar en los reviews')
        //   console.log(reviews);
        //   res.status(200).send({data: reviews});
        

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    login_admin,
    eliminar_etiqueta_admin,
    listar_etiquetas_admin,
    agregar_etiqueta_admin,
    registro_producto_admin,
    listar_productos_admin,
    obtener_producto_admin,
    listar_etiquetas_producto_admin,
    eliminar_etiqueta_producto_admin,
    agregar_etiqueta_producto_admin,
    obtener_portada,
    actualizar_producto_admin,
    listar_variedades_admin,
    actualizar_producto_variedades_admin,
    agregar_nueva_variedad_admin,
    eliminar_variedad_admin,
    listar_inventario_producto_admin,
    listar_variedades_productos_admin,
    registro_inventario_producto_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    verificar_token,
    cambiar_vs_producto_admin,
    obtener_config_admin,
    actualizar_config_admin,
    pedido_compra_cliente,
    obtener_ventas_admin,
    obtener_detalles_ordenes_cliente,
    marcar_finalizado_orden,
    eliminar_orden_admin,
    marcar_envio_orden,
    confirmar_pago_orden,
    registro_compra_manual_cliente,
    eliminar_inventario_producto_admin,
    eliminar_producto_admin,
    obtener_mensajes_admin,
    cerrar_mensaje_admin,
    kpi_ganancias_mensuales_admin,
    obtener_reviews_producto_admin,
    cambiar_vs_reviews_admin
}