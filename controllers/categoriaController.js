var Categoria = require('../models/Categoria');
var fs = require('fs');
var path = require('path');


const crear_categoria_admin = async function(req,res){
    if(req.user){
        console.log('aqui creo la tabla en bd');
        await Categoria.create({
            categorias:[],
            titulo: 'Ecomalki',
            logo: 'logo.png',
            serie:'001',
            correlativo:'00000001',
        });



    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const obtener_categoria_admin = async function(req,res){
    // if(req.user){
        // 64590b09079fdd1b9cd967f5
        let reg = await Categoria.findById({_id:"64590f196002a8208020b554"});
        // console.log('aqui estoy obteniendo categorias');
        // console.log(reg);
        res.status(200).send({data:reg});
       
    // }else{
    //     res.status(500).send({message: 'NoAccess'});
    // }
}

const actualiza_categoria_admin = async function(req,res){
    if(req.user){
        

        let data = req.body;
        
        if(req.files){
            

            var img_path = req.files.logo.path;
            var name = img_path.split('/');
            var logo_name = name[2];

            console.log('aqui reviso logo_name');
            console.log(logo_name);
            //actualizo los datos con la nueva imagen
            let reg = await Categoria.findByIdAndUpdate({_id:"64590f196002a8208020b554"},{
                categorias: JSON.parse(data.categorias),
                titulo: data.titulo,
                logo: logo_name,
                serie:data.serie,
                correlativo:data.correlativo,
            });
            //elimino la imagen anterior
            fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
                if(!err){
                    fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                        if(err) throw err;
                    });
                }
            })

            res.status(200).send({data:reg});
            
        }else{
            //cuando no hay cambios en el logo
            console.log('no hay imagen');
            let reg = await Categoria.findByIdAndUpdate({_id:"64590f196002a8208020b554"},{
                categorias:data.categorias,
                titulo: data.titulo,
                serie:data.serie,
                correlativo:data.correlativo,
            });

            res.status(200).send({data:reg});
        }
        

        

       
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const subir_portada_categoria = async function(req,res){
    
    if(req.user){
        let id = req.params['id'];
        let data = req.body;
        
        console.log(id);
        console.log(data);
        console.log(req);
        var img_path = req.files.portada.path;
        console.log(img_path);
        var name = img_path.split('/');
        console.log(name);
        var imagen_name = name[2];
        console.log(imagen_name );
    
                let reg =await Categoria.findByIdAndUpdate({_id:id},{ $push: {categorias:{
                    titulo: data.titulo,
                    icono: data.icono,
                    portada: imagen_name,
                    _id: data._id
                }}});
    
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

const obtener_logo = async function(req,res){
    var img = req.params['img'];

    console.log('en el controlador al optener el logo');
    console.log(img);
    
    fs.stat('./uploads/configuraciones/'+img, function(err){
        if(!err){
            let path_img = './uploads/configuraciones/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const listar_categorias_publico = async (req,res)=>{
    let reg = await Categoria.findById({_id:'64590f196002a8208020b554'}).populate('productos').populate('_id');
    // console.log('aqui estoy obteniendo categorias');
    // console.log(reg.categorias);
    res.status(200).send({data:reg.categorias});

   
}

// const listar_logo_categoria_publico = async (req,res)=>{
//     let reg = await Categoria.findById({_id:'64590f196002a8208020b554'});
   
//     // res.status(200).send({data:{reg.logo})};
//     res.status(200).send({data:{
//         logo : reg.logo,
//         empresa : reg.titulo
//     }});
 
// }

// console.log('aqui estoy obteniendo categorias');
// console.log(reg);
const listar_logo_categoria_publico = async (req, res) => {
    try {
      // Realizar la consulta a la base de datos
      let reg = await Categoria.findById('64590f196002a8208020b554');
  
      // Verificar si se encontró una categoría con el _id especificado
      if (reg) {
        // Si la categoría existe, devolver los datos
        res.status(200).send({
          data: {
            logo: reg.logo,
            empresa: reg.titulo,
          },
        });
      } else {
        // Si no se encontró la categoría, devolver un mensaje de error o un objeto vacío
        res.status(404).send({ message: 'Categoría no encontrada' });
      }
    } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante la consulta
      res.status(500).send({ message: 'Error en el servidor' });
    }
  };
  

const listar_id_categorias_publico = async (req,res)=>{
    var id = req.params['id'];
    // console.log('aqui estoy obteniendo id');
    // console.log(id);

    let reg = await Categoria.find({categorias:{id} });
    // console.log('aqui estoy obteniendo categorias');
    // console.log(reg);
    res.status(200).send({data:reg});

   
}


module.exports = {
    actualiza_categoria_admin,
    obtener_categoria_admin,
    crear_categoria_admin,
    obtener_logo,
    listar_categorias_publico,
    listar_id_categorias_publico,
    listar_logo_categoria_publico,
    subir_portada_categoria
}