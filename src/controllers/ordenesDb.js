const mongoose = require('mongoose');

const url = process.env.MONGODB_URL

// const url = 'mongodb://localhost:27017/weclash';

const { daoOrdenes } = require('../models/esquemaOrdenes')

class OrdenesDB {
    constructor() {
      mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }, (err) => {
        if (err) {
          console.log(err);
        }else{
          console.log('Conectado a la base en constructor de OrdenesDb');
        }
      })
    }
  
    insertar(data) {
        return daoOrdenes.create(data, (err,res) => {
            if (err) {
              console.log(err);
            }else{
              // console.log(res);
            }
          });
    }
    
    listar() {
        return daoOrdenes.find({}, (err,res) => {
            if (err) {
              console.log(err)
            } else {
      
            }
          });
    }

    getByUsername(username) {
      return daoProductos.find({comprador: username}, (err,res) => {
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
  
module.exports = OrdenesDB;