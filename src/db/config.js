require('dotenv').config();

const mysqlLocal = {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ecommerce'
    }
  }
  const mysqlDBaaS = {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_ADDON_HOST.toString(),
      user: process.env.MYSQL_ADDON_USER.toString(),
      password: process.env.MYSQL_ADDON_PASSWORD.toString(),
      database: process.env.MYSQL_ADDON_DB.toString()
    }
  }
const sqlite3Producto = {
    client: 'sqlite3',
    connection: { filename: 'productos.sqlite' },
    useNullAsDefault: true
}
const sqlite3Carrito = {
  client: 'sqlite3',
  connection: { filename: 'carrito.sqlite' },
  useNullAsDefault: true
}

require('dotenv').config();

const mongoDBaaS = process.env.MONGODB_URL.toString();

module.exports = { mongoDBaaS, mysqlDBaaS, mysqlLocal, sqlite3Producto, sqlite3Carrito };
