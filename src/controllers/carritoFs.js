const fs = require("fs");

let CARRITO_DB = [];

class Carrito {
    constructor(config) {
        this.CARRITO_DB = fs.readFile('carrito.txt', 'utf-8', (err, data)=>{
            if (err) {
                console.log(err)
                console.log('AQUI')
            }else{
                this.CARRITO_DB = JSON.parse(data);
            }
        })
        // this.CARRITO_DB = CARRITO_DB;
    }

    add (data) {
        this.CARRITO_DB.push({
            id: this.CARRITO_DB.length + 1,
            timestamp: Date.now(),
            producto: {
                id: data.id,
                timestamp: data.timestamp,
                nombre: data.nombre,
                descripcion: data.descripcion,
                codigo: data.codigo,
                foto: data.foto,
                precio: data.precio,
                stock: data.stock
            }
        });
        fs.writeFileSync('carrito.txt', JSON.stringify(this.CARRITO_DB))
        return true;
    }

    get () {
        if (this.CARRITO_DB.length<1) return this.CARRITO_DB
        return this.CARRITO_DB;
    }

    getById (id) {
        return this.CARRITO_DB.filter( (orden) => orden.id === parseInt(id) )[0];
    }

    update(id, data) {
        this.CARRITO_DB = this.CARRITO_DB.map( (orden) => {
            if ( orden.id === parseInt(id) ) {
                orden.producto = data.producto
            }
            return orden;
        });
        fs.writeFileSync('carrito.txt', JSON.stringify(this.CARRITO_DB))
        return true;
    }

    remove(id) {
        this.CARRITO_DB = this.CARRITO_DB.filter((orden) => orden.id !== parseInt(id));
        fs.writeFileSync('carrito.txt', JSON.stringify(this.CARRITO_DB))
    }
}

module.exports = Carrito;