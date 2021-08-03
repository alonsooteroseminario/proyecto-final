const mongoose = require('mongoose');

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/ecommerce?retryWrites=true&w=majority';

// const url = 'mongodb://localhost:27017/weclash';

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

class UsuarioDB {
  constructor() {
    mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor de usuarioDb');
      }
    })
  }

  insertar(Usuarios) {
    return daoUsuarios.create(Usuarios, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
        return true;
      }
    });
  }

  listar() {
    return daoUsuarios.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(res)
      }
    }).lean();
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
  }
}

module.exports = UsuarioDB;