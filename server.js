// npm install -g postcss  postcss-cli postcss-cssnext cssnano
require('dotenv').config();

const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5001;
const server = http.createServer(app);

const User = require('./exports/server/entities/User');
const con = require('./exports/server/bdd/bdd-con');
const guid = require('./exports/server/utils/guid');

const resJsonFactory = require('./exports/server/utils/json-responses-format');
const {ERRORS, SUCCESS} = require('./exports/server/utils/messages');

// render engine
app.set('view engine', 'ejs');

// post body parsing json
app.use(bodyParser.json());

// sessions
const connectedUsers = {};

// rendu de l'index
app.get('/', function (req, res, next) {
  setBaseUrl(req);
  res.render('pages/index', {
    env: process.env.ENVIRONMENT,
    min: process.env.MINIFIED,
  });
});

// highscores
app.get('/high-scores', function (req, res, next) {
  setBaseUrl(req);
  con.stats()
  .then((allUserStats)=>{
    res.render('pages/stats', {
      env: process.env.ENVIRONMENT,
      stats: allUserStats
    });
  })
  .catch((error)=>{
    res.json(error)
  })
  
});


// route générique pour les fichiers dossier public ( resources locales )
app.use(express.static('public'))

// bug fix for no source css map file
const noSourced = [
  '/css/%3Cno%20source%3E'
]
// redirection for all get req to the index
app.get("*", function (req, res, next) {
  if (noSourced.includes(req.path)) {
    res.json({ error: ERRORS.MAP_NO_SOURCE });
  } else {
    console.log(ERRORS.ROUTING_ROUTE_DOES_NOT_EXIST, req.path);
    res.redirect("/");
  }
});

// 


// users connection 
app.post('/connect',(req,res, next)=>{
  console.log(req.query);
  console.log('Got body:', req.body);
  const connectInfos = req.body;
  let mail = connectInfos.mail;
  let password = connectInfos.password;
  con.connection(mail, password)
  .then((rep)=>{
    console.log(rep.success);
    let userInfos = rep.original;
    console.log(userInfos);
    let user = connection(userInfos);
    res.json(user.serialize())
  },(err)=>{
    res.json(err)
  })
  
})

// users save
app.post('/save',(req,res, next)=>{
  console.log('save:', req.body);
  let tk = req.body.token;
  let user = connectedUsers[tk];
  if(user){
    // maj de la progression
    user.updateProgress(req.body.progress, con)
    .then((rep)=>{
      console.log('User ['+ tk +'] progress ' + rep.success)      
      res.json(resJsonFactory.success('Progress Saved for User [' + tk + ']'));
    })
    .catch((rep)=>{
      res.json(resJsonFactory.error(rep.error));
    });    
  } else {
    res.json(resJsonFactory.error('not saved bad token'));
  }  
});


// users save && quit
app.post('/quit',(req,res, next)=>{
  console.log('quit:', req.body);
  let tk = req.body.token;
  let user = connectedUsers[tk];
  if(user){
    // maj de la progression
    user.updateProgress(req.body.progress, con)
    .then((rep)=>{
      console.log('User ['+ tk +'] progress ' + rep.success)
      // suppression de la session
      delete connectedUsers[tk];
      console.log('User ['+ tk +'] disconnected')
      res.json(resJsonFactory.success('Progress Saved && User [' + tk + '] disconnected'));
    })
    .catch((rep)=>{
      res.json(resJsonFactory.error(rep.error));
    });    
  } else {
    res.json(resJsonFactory.error('not saved bad token'));
  }
  
});


// new user registration
app.post('/register',(req,res, next)=>{
  // console.log(req.body);
  console.log('Got body:', req.body);
  const connectInfos = req.body;

  let login = connectInfos.login;
  let password = connectInfos.password;
  let mail = connectInfos.mail;
  const progress_sample = require('./exports/server/utils/progress-sample');
  let progress = JSON.stringify(progress_sample);

 // TODO after creation create session and send user token cf : connect
  con.register(mail, login, password, progress)
  .then((rep)=>{
    console.log(rep.success);
    let userInfos = rep.original;
    console.log(userInfos);
    let user = connection(userInfos);
    res.json(user.serialize())
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

function connection (userInfos) {
  let token = guid();
  let user = new User({token:token, login:userInfos.login, progress:userInfos.progress, mail:userInfos.mail})
  connectedUsers[token] = user;
  connectedUsers[token].hash = userInfos.password;
  // console.log(userInfos.password);
  return user
}