const knex = require('knex');

class CarritoDB {

  constructor(config) {
    this.knex = knex(config)
    this.knex.schema.hasTable('carrito')
    .then((exists) => {
      if(!exists){
        return this.knex.schema.createTable('carrito', table => {
          table.increments('carId').primary();
          table.integer('id');
          table.string('timestamp');
          table.string('nombre').notNullable();
          table.string('descripcion');
          table.string('codigo');
          table.string('foto');
          table.integer('precio');
          table.integer('stock');
        })
      }
    })
  }

  add (carrito) {
    return this.knex('carrito').insert(carrito);
  }

  get () {
    return this.knex('carrito').select();
  }

  getById(carId) {
    return this.knex.from('carrito').where('carId', carId).select();
  }

  remove(carId) {
    return this.knex.from('carrito').where('carId', carId).del()
  }

  cerrar() {
    return this.knex.destroy();
  }
  
}

module.exports = CarritoDB;