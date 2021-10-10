const express = require('express');
const router = express.Router();
const MensajeDB = require('../controllers/mensajesDb')
const mensajesDB = new MensajeDB()

router.get('/', (req, res) => {

    if (!req.user.contador){
      req.user.contador = 0
    }
    res.render('chatAdmin', {
      user: req.user,
      userNombre: req.user.username
    })
    // res.sendFile('./index.html', { root:__dirname })
})

router.get('/responder/:id', async (req, res) => {
    const { id } = req.params;
    let menssages = await mensajesDB.listar()
    let menssagesFiltrados = menssages.filter( msg => msg.author == id || msg.author == 'Administrador')
  
    res.render('chatResponder', {
      user: req.user,
      userNombre: req.user.username,
      menssagesFiltrados: menssagesFiltrados
    })
})

router.post('/responder', (req, res) => {
    let data = req.body
    res.redirect(`/chat/responder/${data.usuariorespuesta}`)
})

router.post('/usuario', (req, res) => {
    let data = req.body
    res.redirect(`/chat/${data.username}`)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let menssages = await mensajesDB.listar()
    let menssagesFiltrados = menssages.filter( msg => msg.author == id || msg.author == 'Administrador')
  
    if  (req.user.username == id) {
      res.render('chat', {
        user: req.user,
        userNombre: req.user.username,
        menssagesFiltrados: menssagesFiltrados
      })
    }
    else {
      res.json({error: 'ruta no authorizada'})
      // res.redirect(`/chat/${id}`)
    }
})


module.exports = router;