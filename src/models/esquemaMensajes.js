const mongoose = require('mongoose');

const esquemaMensajes = new mongoose.Schema({

})

const daoMensajes = mongoose.model('Mensajes', esquemaMensajes);

module.exports ={ daoMensajes };
