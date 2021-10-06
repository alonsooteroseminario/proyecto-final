const express = require('express');
require('dotenv').config();
const router = express.Router();
const Factory = require("../controllers/factory");
const OrdenesDB = require('../controllers/ordenesDb');
const ordenesDb = new OrdenesDB()
const factory = new Factory();
var { graphqlHTTP }  = require('express-graphql');
var { buildSchema } = require('graphql');

const tipoPersistencia = 6;

const product = factory.persistencia(tipoPersistencia,"productos");
const carrito = factory.persistencia(tipoPersistencia,"carrito");

/* --------------------- EMAILS Y MESSAGING --------------------------- */
const transporter = require('../middlewares/emails');
const accountSid = process.env.ACCOUNT_SID_TWILIO.toString();
const authToken = process.env.AUTHTOKEN_TWILIO.toString();

const client = require('twilio')(accountSid, authToken);

//Ver todos los carritos
router.get("/listar", async (req, res) => {
  const user = req.user;
  const currentCarrito = await carrito.getByUsername(user.username);

  if (tipoPersistencia == 2 || tipoPersistencia == 3 || tipoPersistencia == 4 || tipoPersistencia == 5 || tipoPersistencia == 6) {
    res.render('carritoSQL', {
      active: "carritoSQL",
      carritos: currentCarrito,
      user: user
    });
  }
  else {
    res.render('carrito', {
      active: "carrito",
      carritos: currentCarrito,
      user: user
    });
  }
});
// buscar orden por Id
router.get("/listar/:id", async (req, res) => {
  const { id } = req.params;
  const currentOrden = await carrito.getById(id)
    if (currentOrden) {
      return res.json(currentOrden);
    }
    res.status(404).json({
      error: "orden no encontrada",
    });
});
// agregar orden al carrito
router.post("/agregar", async (req, res) => {
  const user = req.user;
  const data = req.body;
  // console.log(data)
  const carritos = await carrito.get()
  const products = await product.get()
  let currentProduct = {};
  let objeto = {};
  if (tipoPersistencia == 7) {
    // console.log('AQUI')
    // console.log(products[0])
    // console.log(data)
    currentProduct = await products.find( product => ( (product.prodId == parseInt(data.prodId)) ));
    // console.log(currentProduct)
    objeto = {
      id: carritos.length + 1,
      timestamp: Date.now(),
      producto: {
          username: user.username,
          prodId: currentProduct.prodId,
          timestamp: currentProduct.timestamp,
          nombre: currentProduct.nombre,
          descripcion: currentProduct.descripcion,
          codigo: currentProduct.codigo,
          foto: currentProduct.foto,
          precio: currentProduct.precio,
          stock: currentProduct.stock
      }
    }  
  }
  else{
    currentProduct = products.find( product => ( (product.id == data.id) ));
    objeto = {
      id: carritos.length + 1,
      timestamp: Date.now(),
      producto: {
          username: user.username,
          id: currentProduct.id,
          timestamp: currentProduct.timestamp,
          nombre: currentProduct.nombre,
          descripcion: currentProduct.descripcion,
          codigo: currentProduct.codigo,
          categoria: currentProduct.categoria,
          foto: currentProduct.foto,
          precio: currentProduct.precio,
          stock: currentProduct.stock
      }
    }  
  }
  await carrito.add(objeto.producto)
  res.redirect('http://localhost:8080/carrito/listar')
});

//borrar orden con un boton
router.post("/borrar/:id", async (req, res) => {
    res.redirect('http://localhost:8080/carrito/listar')
    // console.log(req.params.id)
    await carrito.remove(parseInt(req.params.id));
});
router.post('/comprar', async (req, res) => {
  const user = req.user;

  let email = user.username;
  let nombre = user.nombre;

  let numero_administrador = process.env.NUMERO_ADMINISTRADOR.toString();

  const currentCarrito = await carrito.getByUsername(user.username);

  let ordenes = await ordenesDb.listar()

  let totalHtml = ''
  let dataNombre = []
  let dataPrecio = []
  let dataDescription = []

  for (let index = 0; index < currentCarrito.length; index++) {
    const element = currentCarrito[index];

    dataNombre.push(element.nombre)
    dataPrecio.push(element.precio)
    dataDescription.push(element.descripcion)

    let iterableHtml = `<------------------------------------------->
                          <p>  Nombre : ${element.nombre} </p>  
                          <p>  Descripción : ${element.descripcion} </p>
                          <p>  Código : ${element.codigo} </p>
                          <p>  Foto : ${element.foto} </p>
                          <p>  Precio : ${element.precio} </p>
                          <-------------------------------------------> \n\n`;
    totalHtml += iterableHtml
  }

  //enviar email hacia Adm
  const mailOptionsLogin = {
    from: 'Servidor Login',
    to: email,
    subject: `Nuevo pedido de ${nombre} con el email ${email} a las ${new Date().toLocaleString()}`,
    html: `<h1>Lista de Productos: ${currentCarrito.length} Productos en el Carrito</h1>
          ${totalHtml} `
  };
  //enviar whatsapp hacia Adm
  client.messages.create({
    body: `Nuevo pedido de ${nombre} con el email ${email} a las ${new Date().toLocaleString()}`,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${numero_administrador}`
    })
  .then(message => console.log(message.sid))
  .catch(console.log)
  //enviar mensaje usuario comprador
  client.messages.create({
    body: `Hola ${nombre}, tu pedido con el email ${email} ha sido recibido a las ${new Date().toLocaleString()} y se encuentra en proceso`,
    from: '+17637103691',
    to: user.telefono.toString()
  })
  .then(message => console.log(message.sid))
  .catch(console.log)

  transporter.sendMail(mailOptionsLogin, (err, info) => {
    if(err) {
        console.log(err)
        return err
    }
    // console.log(info)
  });

  let ordenesData = {
    id: ordenes.length + 1,
    items: dataNombre,
    descriptionId: dataDescription,
    precioId: dataPrecio,
    fyh: new Date().toLocaleDateString() + new Date().toLocaleTimeString(),
    estado: 'Finalizada',
    comprador: email 
  }
  // console.log(ordenesData)
  await ordenesDb.insertar(ordenesData);
  res.redirect('/carrito/comprafinalizada')
})
router.get('/comprafinalizada', async (req, res) => {
  const user = req.user;
  res.render('comprafinalizada', {
    user: user
  })
})

var schema = buildSchema(`
    type Query {
        carritos: [Carrito]
    },
    type Mutation {
        updateCarritoGraphql(
            username: String!,
            carId: Int!,
            carTimestamp: String!,
            id: Int!,
            timestamp: String!,
            nombre: String!, 
            descripcion: String!, 
            codigo: String!,
            foto: String!,
            precio: Int!,
            stock: Int!
        ): Carrito
        deleteCarritoGraphql(id: Int!): Carrito
        listarCarritoIdGraphql(id: Int!): Carrito
    },
    type Carrito {
        username: String
        carId: Int
        carTimestamp: String
        id: Int
        timestamp: String
        nombre: String
        descripcion: String
        codigo: String
        foto: String
        precio: Int
        stock: Int
    }    
`);

var root = {
  carritos: getCarritos,
  updateCarritoGraphql: updateCarritoGraphql,
  deleteCarritoGraphql: deleteCarritoGraphql,
  listarCarritoIdGraphql: listarCarritoIdGraphql
};

//funcion para POST }
var getCarritos = async function() {
  console.log(await carrito.listar())
  return await carrito.listar();
}
var updateCarritoGraphql = async function({ 
      username, 
      carId, 
      carTimestamp, 
      id, 
      timestamp,
      nombre, 
      descripcion, 
      codigo,
      foto,
      precio,
      stock 
    }) {
  let data = {username,carId,carTimestamp,id,timestamp,nombre,descripcion,codigo,foto,precio,stock}
  return await carrito.update(carId, data)
}
var deleteCarritoGraphql = async function({id}) {
  return await carrito.remove(id);;
};
var listarCarritoIdGraphql = async function({id}) {
  return await carrito.getById(id);
}

router.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

module.exports = router;