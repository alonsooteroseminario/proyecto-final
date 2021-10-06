const mongoose = require('mongoose');

const esquemaProducto = new mongoose.Schema({
  id: { type: Number, require: true },
  timestamp: { type: String, require: true, max:100},
  nombre: { type: String, require: true, max: 100 },
  descripcion: { type: String, require: true, max: 100 },
  codigo: { type: String, require: true, max: 100 },
  foto: { type: String, require: true },
  precio: { type: Number, require: true, max: 100 },
  stock: { type: Number, require: true, max: 100 }
})

const daoProductos = mongoose.model('productos', esquemaProducto);

module.exports ={ daoProductos };