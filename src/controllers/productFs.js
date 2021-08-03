const fs = require("fs");

let PRODUCTS_DB = [];

class Product {
    constructor() {        
        this.PRODUCTS_DB = fs.readFile('productos.txt', 'utf-8', (err, data)=>{
            if (err) {
                console.log(err)
                console.log('AQUI')
            }else{
                this.PRODUCTS_DB = JSON.parse(data);
            }
        })
        // this.PRODUCTS_DB = PRODUCTS_DB;

    }

    add (data) {
        try {
            if(data.nombre === "" || typeof data.nombre === "undefined") return false;
            if(data.precio === "" || typeof data.precio === "undefined") return false;
            data.id = this.PRODUCTS_DB.length + 1;
            this.PRODUCTS_DB.push({
                id: data.id,
                timestamp: Date.now(),
                nombre: data.nombre,
                descripcion: data.descripcion,
                codigo: data.codigo,
                foto: data.foto,
                precio: data.precio,
                stock: data.stock
            });
            fs.writeFileSync('productos.txt', JSON.stringify(this.PRODUCTS_DB))
            return true;
        }
        catch (err){
            console.log('Ups. algo paso'. err);
        }
    }

    get () {
        try {
            if (this.PRODUCTS_DB.length<1) return false
            return this.PRODUCTS_DB;
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    getById (id) {
        try {
            return this.PRODUCTS_DB.filter( (producto) => producto.id === parseInt(id) )[0];
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    getByCodigo (codigo) {
        try {
            return this.PRODUCTS_DB.filter( (producto) => producto.codigo === codigo )[0];
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    getByNombre (nombre) {
        try {
            return this.PRODUCTS_DB.filter( (producto) => producto.nombre === nombre )[0];
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    getByRangoPrecio (precioInferior , precioSuperior) {
        try {
            return this.PRODUCTS_DB.filter( (producto) => 
            (producto.precio < parseInt(precioSuperior )
                && producto.precio > parseInt(precioInferior)) );
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    getByRangoStock (stockInferior , stockSuperior) {
        try {
            return this.PRODUCTS_DB.filter( (producto) => 
            (producto.stock < parseInt(stockSuperior )
                && producto.stock > parseInt(stockInferior)) );
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    update(id, data) {
        try {
            this.PRODUCTS_DB = this.PRODUCTS_DB.map( (producto) => {
                if ( producto.id === parseInt(id) ) {
                    producto.nombre = data.nombre
                    producto.precio = parseInt(data.precio)
                    producto.descripcion = data.descripcion
                    producto.codigo = data.codigo
                    producto.foto = data.foto
                    producto.stock = data.stock
                }
                return producto;
            });
            fs.writeFileSync('productos.txt', JSON.stringify(this.PRODUCTS_DB))
            return true;
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }

    remove(id) {
        try {
            this.PRODUCTS_DB = this.PRODUCTS_DB.filter((producto) => producto.id !== parseInt(id));
            fs.writeFileSync('productos.txt', JSON.stringify(this.PRODUCTS_DB))
        }
        catch (err) {
            console.log('Ups. algo paso'. err);
        }
    }
}

module.exports = Product;