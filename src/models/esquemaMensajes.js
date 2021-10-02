const mongoose = require('mongoose');

const esquemaMensajes = new mongoose.Schema({
    id: { type: Number, require: true },
    author: { type: String, require: true },
    text: { type: String, require: true },
    date: { type: String, require: true }
})

const daoMensajes = mongoose.model('Mensajes', esquemaMensajes);

module.exports = { daoMensajes };
