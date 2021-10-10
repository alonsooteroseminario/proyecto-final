const express = require('express');
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
router.post("/agregar", async (req, res) => {
  const data = req.body;
  if (!admin) {
    await product.add(data)
    res.redirect('http://localhost:8080/productos/agregar');
  }
  else{
    res.json({
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

  if (currentProduct) {
    res.render('productoUnico', {
      foto: currentProduct.foto,
      nombre: currentProduct.nombre,
      codigo: currentProduct.codigo,
      categoria: currentProduct.categoria,
      precio: currentProduct.precio,
      descripcion: currentProduct.descripcion,
      user: user
    });
    // res.json(currentProduct);
  } else {
    res.render('productoUnico',{
      user: user
    })
    // return res.json({error: 'Producto no existente o no encontrado!'})
  }
});
// actualizar producto existente (ADMIN)
router.post("/actualizar/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if (!admin) {
      if(await product.update(id, data)) {
        res.redirect('http://localhost:8080/productos/listar')
      }
      res.status(400)
    }
    else{
      res.json({
        error: -1,
        descripcion: "No cuenta con permisos de administrador para ingresar a esta ruta"
      });
    }
});
// borrar producto (ADMIN)
router.post("/borrar/:id", async (req, res) => {
    const { id } = req.params;
    if (!admin){
      res.redirect('http://localhost:8080/productos/listar')
      await product.remove(id);
    }
    else{
      res.status(404).json({
        error: -1,
        descripcion: "No cuenta con permisos de administrador para ingresar a esta ruta"
      });
    }
});

router.post('/listar/filtrar', async (req, res) => {
  const data = req.body;
  res.redirect(`/productos/listar/categoria/${data.categoria}`)
});

router.get('/listar/categoria/:id', async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const products = await product.get()
  let productosFiltrados = products.filter( prod => prod.categoria == id)
  res.render('vista', {
    active: "vista",
    products: productosFiltrados,
    user: user
  });
})


module.exports = router;