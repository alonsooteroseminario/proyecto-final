const express = require('express');
const { render } = require('pug');
const router = express.Router();
const Factory = require("../controllers/factory");
const factory = new Factory();

const tipoPersistencia = 6;

const product = factory.persistencia(tipoPersistencia,"productos");

const admin = false;

// Ver todos los productos
router.get("/listar", async (req, res) => {
  const user = req.user;
  // console.log(user);
  const products = await product.get()
    res.render('vista', {
      active: "vista",
      products: products,
      user: user
    });
});
// Todos o No hay productos cargados
router.get("/listar", async (req, res) => {
  const products = await product.get()
    if (!products) {
      return res.status(404).json({
        error: "no hay productos cargados",
      });
    }
    res.json(products);
});
// agregar producto nuevo (ADMIN)
router.post("/listar", async (req, res) => {
  const data = req.body;

  if (!admin) {
    if(await product.add(data)) {
      // console.log('AQUI')
      if (data.form === "1" || tipoPersistencia === 5) return res.redirect('http://localhost:8080/productos/agregar');
      res.status(201).json(data);
    }
    res.status(400).send();
  }
  else{
    res.status(404).json({
      error: -1,
      descripcion: "No cuenta con permisos de administrador para ingresar a esta ruta"
    });
  }
});
// buscar por Id
router.get("/listar/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const currentProduct = await product.getById(id)
  if (currentProduct.length != 0) {
    // return res.render('productoUnico', {
    //   currentProduct: currentProduct,
    //   user: user
    // });
    res.json(currentProduct);
  } else {
    res.render('productoUnico',{
      currentProduct: currentProduct,
      user: user
    })
  }
});
// actualizar producto existente (ADMIN)
router.put("/actualizar/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if (!admin) {
      if(await product.update(id, data)) {
        res.status(201).json(data);
      }
      res.status(400).send();
    }
    else{
      res.status(404).json({
        error: -1,
        descripcion: "No cuenta con permisos de administrador para ingresar a esta ruta"
      });
    }
});
// borrar producto (ADMIN)
router.delete("/borrar/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await product.getById(id);
    if (!admin){
      res.json(currentProduct);
      product.remove(id);
    }
    else{
      res.status(404).json({
        error: -1,
        descripcion: "No cuenta con permisos de administrador para ingresar a esta ruta"
      });
    }
});
// buscar por codigo
router.get("/codigo/:codigo", async (req, res) => {
  const data = req.body;
  console.log(data);
  const { codigo } = req.params;
  // console.log(codigo)
  const currentProduct = await product.getByCodigo(codigo.toString())
  // if (data.form === "1") return res.redirect('http://localhost:8080/productos/listar');
  // console.log(currentProduct);
    if (currentProduct) {
      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
});
// buscar por nombre
router.get("/nombre/:nombre", async (req, res) => {
  const { nombre } = req.params;
  // console.log(nombre)
  const currentProduct = await product.getByNombre(nombre)
  // console.log(currentProduct)
    if (currentProduct) {
      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
});
// buscar por precio
router.get("/precio/:precioInferior/:precioSuperior?", async (req, res) => {
  const { precioInferior } = req.params;
  const { precioSuperior } = req.params;
  // console.log(req.params)
  const products = await product.getByRangoPrecio(precioInferior , precioSuperior)
  // console.log(products)
    res.render('vista', {
      active: "vista",
      products: products
    });
});
// buscar por stock
router.get("/stock/:stockInferior/:stockSuperior?", async (req, res) => {
  const { stockInferior } = req.params;
  const { stockSuperior } = req.params;
  // console.log(req.params)
  const products = await product.getByRangoStock(stockInferior , stockSuperior)
  // console.log(products)
    res.render('vista', {
      active: "vista",
      products: products
    });
});


module.exports = router;