const mongoose = require('mongoose');

const esquemaOrdenes = new mongoose.Schema({
    id: { type: Number, require: true },
    items: {
        type: Array,
        default: []
    },
    descriptionId: {
        type: Array,
        default: []
    },
    precioId: {
        type: Array,
        default: []
    },
    fyh: { type: String, require: true },
    estado: { type: String, require: true },
    comprador: { type: String, require: true },
    direccion: { type: String, require: true }
})

const daoOrdenes = mongoose.model('Ordenes', esquemaOrdenes);

module.exports ={ daoOrdenes };