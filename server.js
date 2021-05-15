require('dotenv').config();

const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5001;
const server = http.createServer(app);
const User = require('./exports/server/User')
const con = require('./exports/server/connection');
const guid = require('./exports/server/guid')
app.set('view engine', 'ejs');

const {ERRORS, SUCCESS} = require('./exports/server/messages');

const connectedUsers = {};
// console.log(ERRORS.BDD_USER_ALREADY_EXIST);
// console.log(SUCCESS.BDD_USER_CREATED);

// rendu de l'index avec id
app.get('/', function (req, res, next) {
  setBaseUrl(req);
  res.render('pages/index', {
    env: process.env.ENVIRONMENT,
    login: 'test'
  });
});

// route générique pour les fichiers dossier public ( resources locales )
app.use(express.static('public'))


// redirection for all get req to the index
app.get('*', function(req, res, next){
  console.log(ERRORS.ROUTING_ROUTE_DOES_NOT_EXIST , req.path);
  res.redirect('/');
})
// 
app.use(bodyParser.json());

// users connection 
app.post('/connect',(req,res, next)=>{
  // console.log(req.body);
  console.log('Got body:', req.body);
  const connectInfos = req.body;
  let login = connectInfos.login;
  let password = connectInfos.password;
  con.connection(login,password)
  .then((rep)=>{
    console.log(rep.success);
    let userInfos = rep.original;
    // ICI CREER UN TOKEN ET LE STOCKER AVEC LES INFOS DE L'UTILISATEUR
    // RENVOYER LE TOKEN ET S'EN SERVIR POUR L'UPDATE
    let token = guid(); // faire ca bien
    let user = new User({token:token, login:userInfos.login, progress:userInfos.progress})
    connectedUsers[token] = user;
    res.json(user.serialize())
  },(err)=>{
    res.json(err)
  })
  
})

// users register
app.post('/quit',(req,res, next)=>{
  console.log('quit:', req.body);
  res.json('user disconneted [' + req.body.token + ']')
});


app.post('/register',(req,res, next)=>{
  // console.log(req.body);
  console.log('Got body:', req.body);
  const connectInfos = req.body;

  let login = connectInfos.login;
  let password = connectInfos.password;
  let mail = connectInfos.mail;
  let progress = connectInfos.progress;

  con.register(mail, login,password, progress)
  .then((rep)=>{
    res.json({login:rep.login, progress:rep.progress})
  },(err)=>{
    res.json(err)
  })
  
})
// user Update
// todo update de la progression

// user deconnection
// envoyer une requette lorsque que lutilisateur quitte la page 


// todo voir pour des web socket!? pour gérer la connection / deconnection


// activation du serveur
server.listen(port, function () {
  console.log(`Server is listening on ${port}!`)
});


function setBaseUrl(req) {
  app.locals.baseUrl = ((req.hostname === 'localhost') ? 'http' : 'https') + '://' + req.hostname + ((req.hostname !== 'localhost') ? '' : (':' + port)) + '/';
}