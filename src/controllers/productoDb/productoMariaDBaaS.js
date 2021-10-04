const knex = require('knex');

class ProductoDB {

  constructor(config) {
    this.knex = knex(config)
    this.knex.schema.hasTable('productos')
    .then((exists) =>{
      if(!exists){
        return this.knex.schema.createTable('productos', table => {
          table.increments('id').primary();
          table.string('nombre').notNullable();
          table.string('timestamp');
          table.string('descripcion');
          table.string('codigo');
          table.string('foto');
          table.integer('precio');
          table.integer('stock');
        })
      }
    })
  }

  add (data) {
    const producto = {
      nombre: data.nombre,
      timestamp: Date.now(),
      descripcion: data.descripcion,
      codigo: data.codigo,
      foto: data.foto,
      precio: data.precio,
      stock: data.stock
    }
    return this.knex('productos').insert(producto);
  }

  get () {
    return this.knex('productos').select();
  }

  getById(id) {
    return this.knex.from('productos').where('id', id).select();
  }

  update(id, data) {

    const nuevoNombre = data.nombre;
    const nuevoDescripcion = data.descripcion;
    const nuevoCodigo = data.codigo;
    const nuevoFoto = data.foto;
    const nuevoPrecio = data.precio;
    const nuevoStock = data.stock;

    return this.knex.from('productos').where('id', id).update({
      id: id,
      nombre: nuevoNombre,
      timestamp: Date.now(),
      descripcion: nuevoDescripcion,
      codigo: nuevoCodigo,
      foto: nuevoFoto,
      precio: nuevoPrecio,
      stock: nuevoStock,
    })
  }

  remove(id) {
    return this.knex.from('productos').where('id', id).del()
  }

  cerrar() {
    return this.knex.destroy();
  }

}

module.exports = ProductoDB;