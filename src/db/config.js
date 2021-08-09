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
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm5CH7U1rWKrNK\nTRJpJ74nKIqh71qhqd74x6FvM+qBdLm7XX8YsNMQt9UqEnAi9wQJ5s4yBHWUXw5S\nPLDofDy+v7Y55e9nZj5dwTNDCQBDeHQ0YPq7fh1FR6avvpRbjlaM4uDu0Yiqt1GZ\nxdfE79g9BH7PvUecBOqJIxw9D5UxjWAF5HAbWaoxbTZ2diSodMo79j480sfTnwCs\nuU/ROlFamw5uzEOgi5alU3xNpk6LtFMVCeOOaFCjXzPRTPiZKcuYLAZlpytdz5cH\nv87IHLKUqsVufA2JMMTQi+EL5ukMnjwzY4JlMX7t3rGw3mInU5fRp9jF+YlmPLqO\nZF2pj2ypAgMBAAECggEAAVsgYo4enhHNPypd6n7Z60dNerAd0zEGQIEpc8dqoz04\nY7yIWU3NlHu3V14w2LvhSJas3uQHVs7uRUoCRAyS6JfwHpz9ZkNf7Nisqspg/+tW\nmdIS5UPcHp0YcVCx4jSkj4RvkdTOfzV/9KkYPKKMgxxnWlzhCqLRURrhrI8PJg6o\nBao8LP+zDuL9zR+9SB60uZvAIalv4Xg9bG8reJrxLylp4C3ONe1gv6QhnRhMf1BS\ngnIyKKW7OBAPWYNc98ncfKBBQ/nN1ZeFPBctbBhbWT1RZNtWrVYAifoY7aB7pJmj\n9DoSuLlLnMNjRJ1u6bOXkuTY5X1MWmtRnrUBjlQ5nQKBgQDcUDRpVfEb5FAydFMK\nnH/U7EtMgQ4sOKTT0AsMsJhc0//Qs4U8feY6xjS9eunmkGBh+i/Oq5G5lbnEibep\nxm+wxbDqP+2rQoRanNUnfi2ZlPxXxYj+fH/gWBhsROyNZvtc7GGbzxyd+I/xNrn5\n9zUMXr7BrctFmd3p2pafoqBHLQKBgQDB7Kfw2WBxWRN2fF1dOcc03MDTAZbIbXQa\nKMiTSLs7OczA56wyLDU1+AZmCK3Z7NanlOmtmHKs9j0Hdp5PQ4c33EDV8/mZkm5i\nB0On2JxgmSzRbGnTbSykXPWo5hL6IW4G3N/8xwvr0uvlAObjOPp5g5nD7EhCKf6T\nlpR1aVio7QKBgHn9y1e8Z9q67JFTihvpFnuPMA63s2JXJyXGICgxrNxR42frz830\nJMTMta1p3xR1Q3ldMJWuuO1bc9bZLyLKJ1Rp0xGSvobDOUh3aSwKGTPepG/xiG7p\n/2D5RuTEsXuG147XsSC2aTErzoCRfh9kfDJSUCwskM8EaTWxfQ/92+QtAoGBALMN\nbpbsLqcZhuXsuEvekDcX6JYrLmyK2xtYMrIDApURriMjBZQhy1O0WTwWoWbIzf1X\neldFngRjK0Bb3pnzEMOcAuVJalnIoVCzwl0UnHZ4l7AZ+LA1anWsO0qifD0lZrDB\nebKsmi44xoPgTE7aijJuNyh2XtVwbtUYwKSUCz+VAoGAIfLKctKOp5yeGL+pM17J\n/uP6IhiqK9gjgcFdAOd4j7V1tFlseiXzcxNDj9ajI150HXAyBahF/gMsZjDrfimw\n4z30x2ebnOrnYc2Qg07r0qC2g7gRxoSPRrtxbtGT7TE5OKyQ7l4mx9Mmb2ias1RO\nbRe+AX6auRCZ7yDkWvpjrDI=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-piomu@coderhouse-proyecto-final.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID.toString(),
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-piomu%40coderhouse-proyecto-final.iam.gserviceaccount.com"
}


require('dotenv').config();

const mongoDBaaS = process.env.MONGODB_URL.toString();

module.exports = { 
  mongoDBaaS, 
  mysqlDBaaS, 
  mysqlLocal, 
  sqlite3Producto, 
  sqlite3Carrito,
  configFirebase
};


