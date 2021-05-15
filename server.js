require('dotenv').config();

const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5001;
const server = http.createServer(app);
const User = require('./exports/server/User');
const con = require('./exports/server/connection');
const guid = require('./exports/server/guid');
app.set('view engine', 'ejs');

const {ERRORS, SUCCESS} = require('./exports/server/messages');

app.use(bodyParser.json());

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
    let token = guid();
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
  let tk = req.body.token;
  let user = connectedUsers[tk];
  if(user){
    // maj de la progression
    user.updateProgress(req.body.progress, con);
    // suppression de la session
    delete connectedUsers[tk];
    console.log('User '+ tk +' disconnected')
    res.json('user disconneted [' + tk + ']');
  } else {
    res.json('not saved bad token');
  }

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



// activation du serveur
server.listen(port, function () {
  console.log(`Server is listening on ${port}!`)
});


function setBaseUrl(req) {
  app.locals.baseUrl = ((req.hostname === 'localhost') ? 'http' : 'https') + '://' + req.hostname + ((req.hostname !== 'localhost') ? '' : (':' + port)) + '/';
}