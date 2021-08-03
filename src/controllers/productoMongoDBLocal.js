const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/ecommerce';

const {daoProductos} = require('./esquemaProducto');

class ProductoDB {

  constructor() {
    mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor de productoDb');
        this.DB_PRODUCTOS = this.get();
      }
    })
  }

  add (data) {
    data.id = this.DB_PRODUCTOS.length + 1;
    const producto = {
      id: data.id,
      timestamp: Date.now(),
      nombre: data.nombre,
      descripcion: data.descripcion,
      codigo: data.codigo,
      foto: data.foto,
      precio: data.precio,
      stock: data.stock
    }
    // console.log(producto);
    return daoProductos.create(producto, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
        return true;
      }
    });
  }

  get () {
    return daoProductos.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        this.DB_PRODUCTOS = res;
      }
    }).lean();
  }

  getById(id) {
    return daoProductos.find({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
  }

  update(id, data) {

    const nuevoNombre = data.nombre;
    const nuevoDescripcion = data.descripcion;
    const nuevoCodigo = data.codigo;
    const nuevoFoto = data.foto;
    const nuevoPrecio = data.precio;
    const nuevoStock = data.stock;

    return daoProductos.updateOne({id: id}, {$set: {
      nombre: nuevoNombre,
      descripcion: nuevoDescripcion,
      codigo: nuevoCodigo,
      foto: nuevoFoto,
      precio: nuevoPrecio,
      stock: nuevoStock,
    }}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
        return true;
      }
    });
  }

  remove(id) {
    return daoProductos.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
  }

  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
  }

}

module.exports = ProductoDB;