// Entry point for the game
// Using planetary lander lib 

// function init connected with body onload on index html
console.log('loading index.js');
function init(){

  // 1 connection for persistance or using anon user

  let s = State.getInstance(); 
  Tools.ajaxGet(`./data/main.json`, (mdata) => {
    let mData = JSON.parse(mdata);
    s.menuData = mData.menu;
    console.log(s)
    Tools.ajaxGet(`./data/${Tools.getHash()}.json`, (data) => {
      let d = JSON.parse(data);
      let main = new Main(d);
    });
  });

  //
  // FOR DEBUG ONLY
  // TODO: swap level / reload terrain  
  
  // console.log(Tools.dataLoader.data);
  // Tools.dataLoader.add('main','./data/main.json');
  // // Tools.dataLoader.add('moon','./data/moon.json');
  // // // Tools.dataLoader.add('error','./data/thisfiledoesnotexist.json'); // error not found here
  // Tools.dataLoader.once((data)=>{
  //   console.log(data); // get the data
  //   console.log(Tools.dataLoader.data); // access direct to the data
  //   Tools.dataLoader.clean() // clean up 
  //   console.log(Tools.dataLoader.data); // empty data
  // })
  // Tools.dataLoader.load()

  
  // connection au profil uilisateur
  // Tools.ajaxPost('./connect',{login:'<%= login %>', password:'1234'},(rep)=>{
  //   console.log(rep);
  //   // console.log(JSON.parse(rep));
  //   let userData = JSON.parse(rep);
  //   if(userData.error) {
  //     console.log(userData.error);
  //     return;
  //   };
    
  //   let progress = JSON.parse(userData.progress);
  //   s.user.token = userData.token;
  //   s.user.login = userData.login;
  //   s.user.progress = progress;

  //   console.log(s.user)
  // })
  initFormsValidation ()
  
}

// Using jquery.validate
function initFormsValidation () {
  
  $().ready(function() {
    $('#connectionForm').validate();
    $('#registerForm').validate({
			rules: {				
				rusername: {
					required: true,
					minlength: 3
				},
				rpassword: {
					required: true,
					minlength: 5
				},
				crpassword: {
					required: true,
					minlength: 5,
					equalTo: "#rpassword"
				},
				remail: {
					required: true,
					email: true
				}
			},
			messages: {
				rusername: {
					required: "Please enter a username",
					minlength: "Your username must consist of at least 2 characters"
				},
				rpassword: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long"
				},
				crpassword: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long",
					equalTo: "Please enter the same password as above"
				},
				remail: "Please enter a zizi email address"
			}
    });
  })
  // handler for connection 
  $('#btConnect').click( ()=>{
    console.log('validation?!');
    if($('#connectionForm').valid()){
      console.log('connectionForm is VALID');
    } else {
      console.log('connectionForm is INVALID');
      
    }
  })
  
  // handler for registration 
  $('#btRegister').click( ()=>{
    console.log('validation?!');
    if($('#registerForm').valid()){
      console.log('registerForm is VALID');
    } else {
      console.log('registerForm is INVALID');
      
    }
  })
}


// Force save and quit session
window.onbeforeunload = function(){
  let s = State.getInstance();
  console.log('beforeonload?!');
  Tools.ajaxPost('./quit', s.user ,(rep)=>{
      console.log(rep);
      // console.log(JSON.parse(rep));              
    })
}