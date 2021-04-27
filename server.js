require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
app.set('view engine', 'ejs');


const port = process.env.PORT || 5001;
const server = http.createServer(app);

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
// activation du serveur

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`)
});


function setBaseUrl(req) {
  app.locals.baseUrl = ((req.hostname === 'localhost') ? 'http' : 'https') + '://' + req.hostname + ((req.hostname !== 'localhost') ? '' : (':' + port)) + '/';
}