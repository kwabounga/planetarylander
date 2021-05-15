function guid() {
  rand = function () {
    return Math.floor(Math.random() * 1250)
  }
  return rand() + '-' + rand() + '-' + rand();
}

module.exports = guid;