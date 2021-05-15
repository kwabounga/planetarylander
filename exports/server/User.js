function User (data) {
  this.token = data.token;
  this.login = data.login;
  this.progress = data.progress;
}

User.prototype.serialize = function () {
  return JSON.parse(JSON.stringify(this))
}

module.exports = User;