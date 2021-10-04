const mongoose = require('mongoose');

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/ecommerce?retryWrites=true&w=majority';

// const url = 'mongodb://localhost:27017/weclash';

const { daoMensajes } = require('../models/esquemaMensajes')

class MensajesDB {
    constructor() {
      mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }, (err) => {
        if (err) {
          console.log(err);
        }else{
          console.log('Conectado a la base en constructor de MensajeDb');
        }
      })
    }
  
    insertar(data) {
        return daoMensajes.create(data, (err,res) => {
            if (err) {
              console.log(err);
            }else{
              // console.log(res);
            }
          });
    }
    
    listar() {
        return daoMensajes.find({}, (err,res) => {
            if (err) {
              console.log(err)
            } else {
      
            }
          });
    }

    cerrar() {
        mongoose.disconnect(err => { console.log('desconectado de la base') });
    }

}
  
module.exports = MensajesDB;