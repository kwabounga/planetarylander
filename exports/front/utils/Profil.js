var Profil = Profil || {};

Profil.save = function(state){
  return new Promise((resolve, reject)=>{
    Tools.ajaxPost('./save', state.user ,(rep)=>{
      console.log(rep);
      let response = JSON.parse(rep)
      if(response.error){
        reject(response.error);
      }
      resolve(response.success);
    })
  })
}


Profil.saveAndQuit = function(state){
  return new Promise((resolve, reject)=>{
    Tools.ajaxPost('./quit', state.user ,(rep)=>{
      console.log(rep);
      let response = JSON.parse(rep)
      if(response.error){
        reject(response.error);
      }
      resolve(response.success);
    })
  })
}

Profil.register = function(state, userRegistrationObj){
  return new Promise((resolve, reject)=>{
    Tools.ajaxPost('./register',userRegistrationObj,(rep)=>{
      console.log(rep);
      // console.log(JSON.parse(rep));
      let userData = JSON.parse(rep);
      if(userData.error) {
        console.log(userData.error);
        return;
      };
      let s = State.getInstance(); 
      let progress = JSON.parse(userData.progress);
      state.user.token = userData.token;
      state.user.login = userData.login;
      state.user.progress = progress;

      console.log(state.user)
      resolve(state.user)

      // $('#registerModal').modal('hide');
    })
  })
}

Profil.disconnect = function(userConnectionValues){
  return new Promise((resolve, reject)=>{
    Tools.ajaxPost('./disconnect',userConnectionValues,(rep)=>{
      // todo disconnect;
    })
  })
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