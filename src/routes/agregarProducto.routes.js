const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const user = req.user;
    res.render('nuevo-producto', {
        active: 'nuevo-producto',
        user: user
    })
})

module.exports = router;