const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const router = express.Router();
const Factory = require("../controllers/factory");
const factory = new Factory();

const tipoPersistencia = 6;

const product = factory.persistencia(tipoPersistencia,"productos");
const carrito = factory.persistencia(tipoPersistencia,"carrito");

/* --------------------- EMAILS Y MESSAGING --------------------------- */
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: process.env.NODEMAIL_USER.toString(),
      pass: process.env.NODEMAIL_PASS.toString()
  }
});
const accountSid = process.env.ACCOUNT_SID_TWILIO.toString();
const authToken = process.env.AUTHTOKEN_TWILIO.toString();

const client = require('twilio')(accountSid, authToken);

//Ver todos los productos
router.get("/listar", async (req, res) => {
  const user = req.user;
  const products = await product.get()

  //Aqui se debe filtrar deacuerdo al usuario user
  const currentCarrito = await carrito.getByUsername(user.username);

  if (tipoPersistencia == 2 || tipoPersistencia == 3 || tipoPersistencia == 4 || tipoPersistencia == 5 || tipoPersistencia == 6) {
    res.render('carritoSQL', {
      active: "carritoSQL",
      products: products,
      carritos: currentCarrito,
      user: user
    });
  }
  else {
    res.render('carrito', {
      active: "carrito",
      products: products,
      carritos: currentCarrito,
      user: user
    });
  }
});
//Todos o No hay productos cargados
router.get("/listar", async (req, res) => {
    const carritos = await carrito.get();
      if (!carritos) {
        return res.status(404).json({
          error: "no hay ordenes cargadas en el carrito",
        });
      }
      res.json(carritos);
});
// agregar orden al carrito
router.post("/agregar", async (req, res) => {
  const user = req.user;
  const data = req.body;
  const carritos = await carrito.get()
  // console.log(carritos);
  const products = await product.get()
  // console.log(products);
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
          foto: currentProduct.foto,
          precio: currentProduct.precio,
          stock: currentProduct.stock
      }
    }  
  }
  // console.log(currentProduct);
    if(await carrito.add(objeto.producto)) {
      if (data.form === "1"|| tipoPersistencia === 5) return res.redirect('http://localhost:8080/carrito/listar');
      res.status(201).json(objeto);
    }
    res.status(400).send();
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
//borrar orden con un boton
router.delete("/borrar/:id", async (req, res) => {
    const { id } = req.params;
    const currentOrden = await carrito.getById(id);
      res.json(currentOrden);
      carrito.remove(id);
});
router.post('/comprar', async (req, res) => {
  const user = req.user;

  let email = user.username;
  let nombre = user.nombre;

  let numero_administrador = process.env.NUMERO_ADMINISTRADOR.toString();

  const currentCarrito = await carrito.getByUsername(user.username);

  let totalHtml = ''
  // console.log(user)
  // console.log(currentCarrito)
  for (let index = 0; index < currentCarrito.length; index++) {
    const element = currentCarrito[index];
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



  res.redirect('/carrito/listar')
})

module.exports = router;