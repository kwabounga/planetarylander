
require('dotenv').config();
var hash = require('object-hash');
// console.log(process.env.BDD_NAME,process.env.BDD_PASS,process.env.BDD_USER,process.env.BDD_HOST,);

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.BDD_HOST,
    user : process.env.BDD_USER,
    password : process.env.BDD_PASS,
    database : process.env.BDD_NAME
  }
});
let progress = JSON.stringify({progress:'in progress'})
let progress2 = JSON.stringify({progress:'in progress', bla:'bla'})
// INSERT 
// knex('users').insert({mail:'jeanyves.chaillou@gmail.com4',login:'kwa4',password:hash('1234'), progress:progress}).then((rep)=>{
//   console.log(rep);
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

knex.select('login', 'password', 'progress')
  .from('users')
  .where({password:hash('1234')})
  .then((rep)=>{
    console.log(rep);
  })

  // knex('users')
  // .where({password:hash('1234')})
  // .update({
  //   progress: progress2
  // }).then((rep)=>{
  //   console.log(rep);
  //   process.exit()
  // })

module.exports = knex