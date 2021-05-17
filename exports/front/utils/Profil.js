const Profil = Profil || {};

Profil.save = function(){

}


Profil.saveAndQuit = function(){

}

Profil.register = function(){

}

Profil.disconnect = function(){

}

Profil.connect = function(state, userConnectionValues){
  return new Promise((resolve,reject)=>{
    Tools.ajaxPost('./connect',userConnectionValues,(rep)=>{
      console.log(rep);
      // console.log(JSON.parse(rep));
      let userData = JSON.parse(rep);
      if(userData.error) {
        console.log(userData.error);
        reject(userData.error);
      };
      let s = State.getInstance(); 
      let progress = JSON.parse(userData.progress);
      state.user.token = userData.token;
      state.user.login = userData.login;
      state.user.progress = progress;
  
      console.log(state.user);
      resolve(state.user)
      // $('#dropdownConnect').dropdown('hide');
    })
  })
  
}