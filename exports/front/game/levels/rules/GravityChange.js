/**
 * Gravity change object 
 * @param {PIXI.engine} engine - the pixi engine
 * @param {object} params - the gravity change rule json object
 * @returns {gsap.tween} - the tween to control gravity
 */
function GravityChange(engine, params) {
  return gsap.fromTo(engine.world.gravity, params.from,params.to);
}


/**
 * loop update 
 */
GravityChange.prototype.update = function () {

  
}