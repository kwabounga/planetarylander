require('dotenv').config();

const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5001;
const server = http.createServer(app);

const con = require('./exports/server/connection');

app.set('view engine', 'ejs');




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
app.get('*', function(req,res,next){
  res.redirect('/')
})

app.use(bodyParser.json());
app.post('/connect',(req,res, next)=>{
  // console.log(req.body);
  console.log('Got body:', req.body);
  const connectInfos = req.body;
  let login = connectInfos.login;
  let password = connectInfos.password;
  con.connection(login,password)
  .then((rep)=>{
    res.json({login:rep.login, progress:rep.progress})
  },(err)=>{
    res.json(err)
  })
  
})


// activation du serveur
server.listen(port, function () {
  console.log(`Server is listening on ${port}!`)
});


function setBaseUrl(req) {
  app.locals.baseUrl = ((req.hostname === 'localhost') ? 'http' : 'https') + '://' + req.hostname + ((req.hostname !== 'localhost') ? '' : (':' + port)) + '/';
}