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
const configFirebase = {
  type: "service_account",
  project_id: "coderhouse-proyecto-final",
  private_key_id: process.env.FIREBASE_KEY_ID.toString(),
  private_key: process.env.FIREBASE_PRIVATE_KEY.toString(),
  client_email: "firebase-adminsdk-piomu@coderhouse-proyecto-final.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID.toString(),
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-piomu%40coderhouse-proyecto-final.iam.gserviceaccount.com"
}

const mongoDBaaS = process.env.MONGODB_URL.toString();

module.exports = { 
  mongoDBaaS, 
  mysqlDBaaS, 
  mysqlLocal, 
  sqlite3Producto, 
  sqlite3Carrito,
  configFirebase
};


