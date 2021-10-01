const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
    nombre: { type: String, require: true, max: 100 },
    username: { type: String, require: true, max: 100 },
    edad: { type: String, require: true, max: 100 },
    foto: { type: String, require: true, max: 100 },
    telefono: { type: String, require: true, max: 100 },
    hashPassword: { type: String, require: true, max: 100 },
    direccion: { type: String, require: true, max: 100 }
})

const daoUsuarios = mongoose.model('usuarios', esquemaUsuario);

module.exports ={ daoUsuarios };