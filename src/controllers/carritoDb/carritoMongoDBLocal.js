const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/ecommerce';

const {daoCarritos} = require('../../models/esquemaCarrito');

class CarritoDB {

  constructor() {
    mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor de CarritoDb');
        this.DB_CARRITO = this.get();
      }
    })
  }

  add (data) {
    data.carId = this.DB_CARRITO.length + 1;
    const carrito = {
      carId: data.carId,
      carTimestamp: Date.now(),
      id: data.id,
      timestamp: data.timestamp,
      nombre: data.nombre,
      descripcion: data.descripcion,
      codigo: data.codigo,
      foto: data.foto,
      precio: data.precio,
      stock: data.stock
    }
    return daoCarritos.create(carrito, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
        return true;
      }
    });
  }

  get () {
    return daoCarritos.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(res)
        this.DB_CARRITO = res;
      }
    }).lean();
  }

  getById(id) {
    return daoCarritos.find({carId: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    }).lean();
  }

  update(id, data) {

    const nuevoId = data.id;
    const nuevoTimestamp = data.timestamp;
    const nuevoNombre = data.nombre;
    const nuevoDescripcion = data.descripcion;
    const nuevoCodigo = data.codigo;
    const nuevoFoto = data.foto;
    const nuevoPrecio = data.precio;
    const nuevoStock = data.stock;

    return daoCarritos.updateOne({carId: id}, {$set: {
      carId: id,
      carTimestamp: Date.now(),
      id: nuevoId,
      timestamp: nuevoTimestamp,
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
    return daoCarritos.deleteOne({carId: id}, (err,res) => {
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

module.exports = CarritoDB;