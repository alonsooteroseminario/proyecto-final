const express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config(  
  {
    path: path.resolve(process.env.NODE_ENV + '.env')
  }
);
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bCrypt = require('bcrypt');
const UsuarioDB = require('./controllers/usuarioDb/usuariosDb.js');
const usuarioDB = new UsuarioDB();
const MongoStore = require('connect-mongo');
const session = require('express-session');
const transporter = require('./middlewares/emails')
const cookieParser = require('cookie-parser');
const { logger, loggerWarn, loggerError } = require('./utils/logger');
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
const compression = require('compression');

var hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: 'main.hbs',
  allowedProtoMethods: {
    trim: true
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser());

/* ------------- VALIDATE PASSWORD ---------------- */
const isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.hashPassword);
}
let createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/* ------------------ PASSPORT -------------------- */
passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {

    try{

      const { nombre } = req.body
      const { edad } = req.body
      const { foto } = req.body
      const { telefono } = req.body
      const { direccion } = req.body
    
      let usuarios = await usuarioDB.listar();
    
      const usuario = usuarios.find(usuario => usuario.username == username)
    
      if (usuario) {
        return done('already registered')
      }
    
      const hashPassword = createHash(password);
    
      const user = {
        nombre,
        username,
        edad,
        foto,
        telefono,
        hashPassword,
        direccion,
      }
    
      const mailOptionsLogin = {
        from: 'Servidor Login',
        to: process.env.NODEMAIL_USER.toString(),
        subject: `Nuevo Registro a las ${new Date().toLocaleString()}`,
        html: `<h1>Se ha registrado un nuevo usuario a las ${new Date().toLocaleString()} </h1>\n\n
                Nombre: ${nombre} \n
                Email: ${username} \n
                Edad: ${edad} \n
                Foto: ${foto} \n
                Teléfono: ${telefono} \n
                Dirección: ${direccion}`
      };
    
      transporter.sendMail(mailOptionsLogin, (err, info) => {
          if(err) {
              console.log(err)
              return err
          }
          // console.log(info)
      })
    
      usuarios.push(user)
    
      await usuarioDB.insertar(usuarios);

      logger.info('Register -----------------> OK');
      loggerWarn.warn('Register -----------------> OK')
    
      return done(null, user)

    }catch (err) {
      loggerWarn.warn('Error message: ' + err)
      logger.info('Error message: ' + err);
      loggerError.error('Error message: ' + err);
    }

}));
passport.use('login', new LocalStrategy(async (username, password, done) => {

    try {
      let usuarios = await usuarioDB.listar();

      const user = usuarios.find(usuario => usuario.username == username)
    
      if (!user) {
        return done(null, false)
      }
    
      if (!isValidPassword(user, password)) {
        return done(null, false)
      }
    
      user.contador = 0

      logger.info('Login -----------------> OK');
      loggerWarn.warn('Login -----------------> OK')
    
      return done(null, user);
    } catch (err) {
      loggerWarn.warn('Error message: ' + err)
      logger.info('Error message: ' + err);
      loggerError.error('Error message: ' + err);
    }

}));
passport.serializeUser(function (user, done) {
  done(null, user.username);
});
passport.deserializeUser(async function (username, done) {
  let usuarios = await usuarioDB.listar();
  const usuario = usuarios.find(usuario => usuario.username == username)
  done(null, usuario);
});
/* --------------------- AUTH --------------------------- */
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* --------------------- MONGO SESSION --------------------------- */
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/sesiones?retryWrites=true&w=majority';

app.use(session({
  store: MongoStore.create({
    mongoUrl: url,
    ttl: parseInt(process.env.TIME_SESSION), // = 10 min. Default
    mongoOptions: advancedOptions }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/productos", isAuth, require("./routes/products.routes"));
app.use("/productos/agregar", isAuth, require('./routes/agregarProducto.routes'));
app.use('/carrito', isAuth, require("./routes/carrito.routes"));
app.get('/', (req, res) => {
  res.render('login')
})

/* --------------------- PASSPORT ROUTES --------------------------- */
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/productos/listar' }))
app.get('/faillogin', (req, res) => {
  res.render('login-error', {});
})
app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/productos/listar' }))
app.get('/failregister', (req, res) => {
  res.render('register-error', {});
})
/* --------- LOGIN ---------- */
app.get('/login', (req, res) => {
    res.render('login')
  })
/* --------- REGISTER ---------- */
app.get('/register', (req, res) => {
    // console.log(req);
    res.render('register')
})
/* --------- LOGOUT ---------- */
app.get('/logout', (req, res) => {
  req.logout();
  setTimeout(function(){ 
    res.redirect('/login');
  }, 2000);
})

app.get('/chat', isAuth, (req, res) => {
  if (!req.user.contador){
    req.user.contador = 0
  }
  // res.status(200)
  res.sendFile('./index.html', { root:__dirname })
});
/* --------- INFO ---------- */
app.get('/info', compression(), (req, res) => {
  try {
    console.log('Console log INFO')
    logger.info('Mensaje info -----------------> OK');
    loggerWarn.warn('Mensaje warn -----------------> OK')
    const numCPUs = require('os').cpus().length
    res.render('info', {
      user: req.user,
      info: process,
      argv: process.argv,
      memoryUsage: process.memoryUsage(),
      numCPUs: numCPUs,
    });
  } catch(err) {
    loggerWarn.warn('Error message: ' + err)
    logger.info('Error message: ' + err);
    loggerError.error('Error message: ' + err);
  }
});

app.get('/config', (req, res) => {
  try {
    res.render('config', {
      user: req.user,
      info: process,
      NODE_ENV: process.env.NODE_ENV,
      port: process.env.PORT,
      url: process.env.MONGODB_URL,
      mail: process.env.GMAIL_EMAIL,
      timeSession: process.env.TIME_SESSION
    });
  } catch(err) {
 
  }
})

const MensajeDB = require('./controllers/mensajesDb')
const mensajesDB = new MensajeDB()

io.on('connection', async socket => {
  console.log('Un cliente se ha conectado')
  let messages = await mensajesDB.listar()
  socket.emit('messages', messages)

  socket.on('new-message', async data => {
      messages.push(data)
      await mensajesDB.insertar(messages)
      io.sockets.emit('messages', messages)
  })
})

const port = parseInt(process.argv[2]) || process.env.PORT || 8080;

console.log(process.env.NODE_ENV)
const server = httpServer.listen(port, () => {
  logger.info('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => {
  logger.info('Error message: ' + err); 
  loggerError.error('Error message: ' + err);
});
