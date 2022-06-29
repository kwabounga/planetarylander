/**
 * Util guid
 * @returns uniq id
 */
function guid() {
  let rand = function () {
    return Math.floor(Math.random() * 1250)
  }
  let now = Date.now()
  return rand() + '-' + rand() + '-' + rand() + '-' + now;
}

module.exports = guid;