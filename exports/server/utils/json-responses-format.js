const success = function(msg) {
  return {success:msg};
}

const error = function(msg) {
  return {error:msg};
}

module.exports = {
  success,
  error
}