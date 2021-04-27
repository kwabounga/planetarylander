
require('dotenv').config();
// var hash = require('object-hash');
// console.log(process.env.BDD_NAME,process.env.BDD_PASS,process.env.BDD_USER,process.env.BDD_HOST,);


const bcrypt = require('bcrypt');
const saltRounds = 10;


const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.BDD_HOST,
    user : process.env.BDD_USER,
    password : process.env.BDD_PASS,
    database : process.env.BDD_NAME
  },debug: true
});
let progress = JSON.stringify({progress:'in progress'})
let progress2 = JSON.stringify({progress:'in progress', bla:'bla'})
// INSERT 

//REGISTER et hashage du mdp Ok
const register = function(mail, login, password, progress) {
  return new Promise((resolve, reject)=>{
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if(err) reject(err)
        knex('users').insert({mail:mail,login:login,password:hash, progress:progress}).then((rep)=>{
          // console.log(rep);
          resolve(rep)
        })
    });
  })
}
// register('test@test.fr','test', '1234', progress2)
// .then((rep)=>{
//   console.log(rep);
// }).catch((err)=>{
//   console.log(err);
  
// })





// DELETE
// knex('users')
// // .where('mail', 'jeanyves.chaillou@gmail.com3')
// .where('mail', 'jeanyves.chaillou@gmail.com4')
// .del().then(()=>{
  
//   knex.select('mail', 'login', 'password', 'progress').from('users').then((rep)=>{
//     console.log(rep);
//     process.exit()
//   })
// })





/// SELECT
// knex.select('mail', 'login', 'password', 'progress').from('users').then((rep)=>{
//   console.log(rep);
//   process.exit()
// })




// Connection OK and Verification du mdp
const connection = function(login, password) {
  return new Promise((resolve,reject)=>{
    knex.select('mail','login', 'password', 'progress')
    .from('users')
    .where({login:login})
    .then((rep)=>{
      const userObj = rep[0];
      if(userObj === undefined){
        reject({error:'l\'utilisateur n\'existe pas '})
      }
      let hash = userObj.password
      bcrypt.compare(password, hash).then((result)=>{
        if(result){
          resolve(userObj)
        } else {
          reject({error:'mot de passe incorrect'})
        }
      })
    }).catch((err)=>{
      reject({error:err})
    })

  })
}
// connection('test','1234')
// .then((rep)=>{
//   console.log('you are logged! ', rep, JSON.parse(rep.progress));
// })
// .catch((err)=>{
//   console.log(err.error);
// })


//UPDATING PROGRESSION OK
const updateProgress = function(login,progress) {
  return new Promise((resolve,reject)=>{
    knex('users')
    .where({login:login})
    .update({progress:progress})
    .then((rep)=>{
      resolve({success:'the progress is updated'})
    }).catch((err)=>{
      reject({error:err})
    })
  })
}
// updateProgress('test', progress)
// .then((rep)=>{
//   console.log(rep.success);
// })






module.exports = {
  connection: connection,
  register: register,
  updateProgress: updateProgress,
};