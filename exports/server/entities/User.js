/**
 * User object
 * @param {User} data 
 */

function User (data) {
  this.token = data.token;
  this.login = data.login;
  this.mail = data.mail;
  this.progress = data.progress;
}

User.prototype.serialize = function () {
  let publicUser = {
    token: this.token,
    mail: this.mail,
    progress: this.progress,
  }
  return JSON.parse(JSON.stringify(publicUser))
}
User.prototype.updateProgress = function (progress,con) {
  console.log(`User[${this.token}][${this.mail}].updateProgress`, progress);
  return con.updateProgress(this.login, JSON.stringify(progress));
}

module.exports = User;