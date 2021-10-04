const admin = require('firebase-admin');
const { configFirebase } = require('../../db/config');
const serviceAccount = configFirebase;

class ProductoDB {

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.db = admin.firestore();
      this.query = this.db.collection('productos');
      console.log('Firebase productos conectado!');
   }else {
      admin.app(); // if already initialized, use that one
      this.db = admin.firestore();
      this.query = this.db.collection('productos');
      console.log('Firebase productos conectado!');
   }
  }

  add (producto) {
    let id = this.PRODUCTS_DB.length + 1;
    const nuevoProducto = {
      prodId: id,
      timestamp: Date.now(),
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      codigo: producto.codigo,
      foto: producto.foto,
      precio: producto.precio,
      stock: producto.stock
    }
    return this.query.doc().create(nuevoProducto);
  }

  async get () {
    const querySnapshot = await this.query.get();
    // console.log(querySnapshot);
    let docs = querySnapshot.docs;
    // console.log(docs);
    const response = docs.map( (doc) => ({
      prodId: doc.data().prodId,
      timestamp: doc.data().timestamp,
      nombre: doc.data().nombre,
      descripcion: doc.data().descripcion,
      codigo: doc.data().codigo,
      foto: doc.data().foto,
      precio: doc.data().precio,
      stock: doc.data().stock
    }))
    this.PRODUCTS_DB = response;
    return response;
  }

  async getById(prodId) {
    const item = await this.query.doc(`${prodId}`).get();
    return item.data();
  }

  async update(prodId, data) {

    const nuevoNombre = data.nombre;
    const nuevoDescripcion = data.descripcion;
    const nuevoCodigo = data.codigo;
    const nuevoFoto = data.foto;
    const nuevoPrecio = data.precio;
    const nuevoStock = data.stock;

    const doc = await this.query.doc(`${prodId}`);
    let item = await doc.update({
      nombre: nuevoNombre,
      descripcion: nuevoDescripcion,
      codigo: nuevoCodigo,
      foto: nuevoFoto,
      precio: nuevoPrecio,
      stock: nuevoStock,
    });
    return item.data();
  }

  async remove(prodId) {

    const doc = await this.query.doc(`${prodId}`);
    const item = await doc.delete();

    return true;
  }

}

module.exports = ProductoDB;