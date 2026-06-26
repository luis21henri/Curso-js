require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose')

// CORREÇÃO: Removidas as opções antigas que causavam o crash (MongoParseError)
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit('pronto');
  })
  .catch(e => console.log(e));

const session = require('express-session')
const { MongoStore } = require('connect-mongo')
const flash = require('connect-flash')

const routes = require('./routes')
const path = require('path') 
const helmet = require('helmet')
const csrf = require('csurf')
const {middlewareGlobal, checkCsurfError, csrfMiddleware} = require('./src/middlewares/middleware')

// CONFIGURAÇÃO CORRETA DA PORTA PARA O RENDER
const port = process.env.PORT || 3000;

app.use(helmet())
app.use(express.urlencoded(
  {
    extended: true
  }
))

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
  secret: 'asdashfsajhfsajfhasjfajh',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, //7 dias
    httpOnly: true
  }
})

app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())

app.use(middlewareGlobal)
app.use(checkCsurfError)
app.use(csrfMiddleware)
app.use(routes);

app.on('pronto', () => {
  // Agora usando a variável dinâmica ajustada para servidores na nuvem
  app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
  }); 
});
