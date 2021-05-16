
require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const {ERRORS,SUCCESS} = require('../utils/messages');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.BDD_HOST,
    port : process.env.BDD_PORT,
    user : process.env.BDD_USER,
    password : process.env.BDD_PASS,
    database : process.env.BDD_NAME
  },debug: true
});

// INSERT 

//REGISTER et hashage du mdp Ok
const register = function(mail, login, password, progress) {
  return new Promise((resolve, reject)=>{
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        let userObj = {mail:mail,login:login,password:hash, progress:progress};
        if(err) reject(err)
        knex('users').insert(userObj)
        .then((rep)=>{
          console.log(SUCCESS.BDD_USER_CREATED);
          resolve({success:SUCCESS.BDD_USER_CREATED, original:userObj})
        })
        .catch((err)=>{
          console.log(ERRORS.BDD_USER_ALREADY_EXIST);
          reject({error:ERRORS.BDD_USER_ALREADY_EXIST, original:err})
        })
    });
  })
}
// let progress = {
//   progress:{test:'blaaaaa'}
// }
// let jsonProgress = JSON.stringify(progress);
// register('test@test.fr','test', '1234', jsonProgress)
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
const connection = function(mail, password) {
  return new Promise((resolve,reject)=>{
    knex.select('mail','login', 'password', 'progress')
    .from('users')
    .where({mail:mail})
    .then((rep)=>{
      const userObj = rep[0];
      if(userObj === undefined){
        reject({error:ERRORS.BDD_USER_DOES_NOT_EXIST})
      }
      let hash = userObj.password
      bcrypt.compare(password, hash).then((result)=>{
        if(result){
          resolve({success:SUCCESS.BDD_USER_LOGGED, original:{mail:userObj.mail,login:userObj.login,progress:userObj.progress}})
        } else {
          reject({error:ERRORS.BDD_USER_WRONG_PASSWORD})
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