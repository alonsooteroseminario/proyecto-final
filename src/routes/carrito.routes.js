const express = require('express');
const router = express.Router();
const Factory = require("../controllers/factory");
const factory = new Factory();

const tipoPersistencia = 6;

const product = factory.persistencia(tipoPersistencia,"productos");
const carrito = factory.persistencia(tipoPersistencia,"carrito");

//Ver todos los productos
router.get("/listar", async (req, res) => {
  const user = req.user;
  const products = await product.get()

  //Aqui se debe filtrar deacuerdo al usuario user
  const carritos = await carrito.get();
  const currentCarrito = await carrito.getByUsername(user.username);
  console.log(currentCarrito);

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

module.exports = router;