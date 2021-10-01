// import express from 'express';
// import path from 'path';
// import Product from '../controllers/product';

const express = require('express');
const router = express.Router();
const path = require('path');

const Product = require("../controllers/productoDb/productFs");

const product = new Product();


router.get('/', (req, res) => {
    const user = req.user;
    const productos = product.get()
    res.render('nuevo-producto', {
        active: 'nuevo-producto',
        productos: productos,
        user: user
    })
})

module.exports = router;