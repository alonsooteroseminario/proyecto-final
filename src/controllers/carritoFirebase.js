const admin = require('firebase-admin');
const serviceAccount = require('../db/configFirebase.json');

class CarritoDB {

  constructor() {
    if (!admin.apps.length){
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.db = admin.firestore();
      this.query = this.db.collection('carrito');
      console.log('Firebase carritos conectado!');
    }else {
      admin.app(); // if already initialized, use that one
      this.db = admin.firestore();
      this.query = this.db.collection('carrito');
      console.log('Firebase carritos conectado!');
   }
  }

  add (carrito) {
    let id = this.CARRITO_DB.length + 1;
    const nuevoCarrito = {
      carId: id,
      timestamp: Date.now(),
      producto: {
        prodId: carrito.prodId,
        timestamp: carrito.timestamp,
        nombre: carrito.nombre, 
        descripcion: carrito.descripcion,
        codigo: carrito.codigo,
        foto: carrito.foto,
        precio: carrito.precio,
        stock: carrito.stock,
      }
    }
    return this.query.doc().create(nuevoCarrito);
  }

  async get () {
    const querySnapshot = await this.query.get();
    // console.log(querySnapshot);
    let docs = querySnapshot.docs;
    // console.log(docs);
    const response = docs.map( (doc) => ({
      carId: doc.data().id,
      timestamp: doc.data().timestamp,
      producto: doc.data().producto
    }))
    this.CARRITO_DB = response;
    return response;
  }

  async getById(carId) {
    const item = await this.query.doc(`${carId}`).get();
    return item.data();
  }

  async update(carId, data) {

    const nuevoNombre = data.nombre;
    const nuevoDescripcion = data.descripcion;
    const nuevoCodigo = data.codigo;
    const nuevoFoto = data.foto;
    const nuevoPrecio = data.precio;
    const nuevoStock = data.stock;

    const doc = await this.query.doc(`${carId}`);
    let item = await doc.update({
      timestamp: Date.now(),
      producto: {      
        nombre: nuevoNombre, 
        descripcion: nuevoDescripcion,
        codigo: nuevoCodigo,
        foto: nuevoFoto,
        precio: nuevoPrecio,
        stock: nuevoStock,
      }
    });
    return item.data();
  }

  async remove(carId) {

    const doc = await this.query.doc(`${carId}`);
    const item = await doc.delete();

    return true;
  }

}

module.exports = CarritoDB;