function User (data) {
  this.token = data.token;
  this.login = data.login;
  this.progress = data.progress;
}

User.prototype.serialize = function () {
  return JSON.parse(JSON.stringify(this))
}
User.prototype.updateProgress = function (progress,con) {
  console.log(`User[${this.token}][${this.login}].updateProgress`, progress);
  con.updateProgress(this.login, JSON.stringify(progress))
  .then((rep)=>{
    console.log(rep.success);
  })
  .catch((rep)=>{
    console.log(rep.error);
  })
}

module.exports = User;