const ProductFs = require("./productFs");
const ProductMemoria = require("./productoMemoria");
const ProductMariaDBLocal = require('./productoMariaDBLocal');
const ProductMariaDBaaS = require('./productoMariaDBaaS');

const ProductMongoDBLocal = require('./productoMongoDBLocal');
const ProductMongoDBaaS = require('./productoMongoDBaaS');
const ProductFirebase = require('./productoFirebase');

const CarritoFs = require("./carritoFs");
const CarritoMemoria = require("./carritoMemoria");
const CarritoMariaDBLocal = require('./carritoMariaDBLocal');
const CarritoMariaDBaaS = require('./carritoMariaDBaaS');

const CarritoMongoDBLocal = require('./carritoMongoDBLocal');
const CarritoMongoDBaaS = require('./carritoMongoDBaaS');
const CarritoFirebase = require('./carritoFirebase');

const { mysqlLocal:configLocal } = require('../db/config')
const { mysqlDBaaS:configDBaaS } = require('../db/config')
const { sqlite3Producto } = require('../db/config');
const { sqlite3Carrito } = require('../db/config');

class Factory {

    constructor() {

    }

    persistencia(tipo, elemento) {
        if (tipo == 0 && elemento == "productos") {
            const productMemoria = new ProductMemoria()
            return productMemoria;
        }
        if (tipo == 1 && elemento == "productos") {
            const productFs = new ProductFs()
            return productFs;
        }
        if (tipo == 2 && elemento == "productos") {
            const productMariaDBLocal = new ProductMariaDBLocal(configLocal)
            return productMariaDBLocal;
        }
        if (tipo == 3 && elemento == "productos") {
            const productMariaDBaaS = new ProductMariaDBaaS(configDBaaS)
            return productMariaDBaaS;
        }
        if (tipo == 4 && elemento == "productos") {
            const productMariaDBLocal = new ProductMariaDBLocal(sqlite3Producto)
            return productMariaDBLocal;
        }
        if (tipo == 5 && elemento == "productos") {
            const productMongoDBLocal = new ProductMongoDBLocal();
            return productMongoDBLocal;
        }
        if (tipo == 6 && elemento == "productos") {
            const productMongoDBaaS = new ProductMongoDBaaS();
            return productMongoDBaaS;
        }
        if (tipo == 7 && elemento == "productos") {
            const productFirebase = new ProductFirebase();
            return productFirebase;
        }



        if (tipo == 0 && elemento == "carrito") {
            const carritoMemoria = new CarritoMemoria();
            return carritoMemoria;
        }
        if (tipo == 1 && elemento == "carrito") {
            const carritoFs = new CarritoFs();
            return carritoFs;
        }
        if (tipo == 2 && elemento == "carrito") {
            const carritoMariaDBLocal = new CarritoMariaDBLocal(configLocal);
            return carritoMariaDBLocal;
        }
        if (tipo == 3 && elemento == "carrito") {
            const carritoMariaDBaaS = new CarritoMariaDBaaS(configDBaaS);
            return carritoMariaDBaaS;
        }
        if (tipo == 4 && elemento == "carrito") {
            const carritoMariaDBLocal = new CarritoMariaDBLocal(sqlite3Carrito);
            return carritoMariaDBLocal;
        }
        if (tipo == 5 && elemento == "carrito") {
            const carritoMongoDBLocal = new CarritoMongoDBLocal();
            return carritoMongoDBLocal;
        }
        if (tipo == 6 && elemento == "carrito") {
            const carritoMongoDBaaS = new CarritoMongoDBaaS();
            return carritoMongoDBaaS;
        }
        if (tipo == 7 && elemento == "carrito") {
            const carritoFirebase = new CarritoFirebase();
            return carritoFirebase;
        }
    }   
}

module.exports = Factory;