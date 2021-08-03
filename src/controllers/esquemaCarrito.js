const mongoose = require('mongoose');

const esquemaCarrito = new mongoose.Schema({
  username: { type: String, require: true, max:100},
  carId: { type: Number, require: true },
  carTimestamp: { type: String, require: true, max:100},
  id: { type: Number, require: true },
  timestamp: { type: String, require: true, max:100},
  nombre: { type: String, require: true, max: 100 },
  descripcion: { type: String, require: true, max: 100 },
  codigo: { type: String, require: true, max: 100 },
  foto: { type: String, require: true, max: 100 },
  precio: { type: Number, require: true, max: 100 },
  stock: { type: Number, require: true, max: 100 }
})

const daoCarritos = mongoose.model('carrito', esquemaCarrito);

module.exports ={ daoCarritos };
