/**
 * Create a lander
 * @param {PIXI.Container} stage the PIXI stage
 * @param {object} params the lander params
 * @class PIXI.extras.AnimatedSprite 
 */
function Lander(stage, params) {
  this.params = params;
  PIXI.extras.AnimatedSprite.call(this, [
    PIXI.Texture.EMPTY
  ]);
  this.stabilizers = [];
  this.reactor = null;
  this.shell = null;
  this.flag = null;

  this.addStabilizers(this.params.stabilizers);
  this.addReactor(this.params.reactor);
  this.addShell(this.params.sprite);
  this.addFlag(this.params.flag);

  this.gotoAndPlay(0);
  stage.addChild(this);
}
/**
 * proto
 */
Lander.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

/**
 * Create the shell sprite
 * and apply shell params
 * @param {string} sprite the sprite name 
 */
Lander.prototype.addShell = function (sprite) {
  let s = new PIXI.Sprite(PIXI.Texture.from(sprite));
  this.addChild(s);
  s.anchor.set(0.5);
  this.shell = s;
};
/**
 * Create the flag sprite
 * and apply flag params
 * @param {object} params the sprite parameters from json
 */
Lander.prototype.addFlag = function (params) {
  let f = new Flag(params);
  f.x = params.x;
  f.y = params.y;
  if (params.rotation) {
    f.rotation = params.rotation;
  }
  this.addChild(f);
  f.visible = false;
  this.flag = f;
};
/**
 * Create the reactor sprite
 * and apply reactor params
 * @param {object} params the sprite parameters from json 
 */
Lander.prototype.addReactor = function (params) {
  let r = new Reactor(params);
  r.x = params.x;
  r.y = params.y;
  this.addChild(r);
  this.reactor = r;
};

/**
 * Create the stabilizers sprite
 * and apply stabilizers params
 * @param {object} parshowams the sprite parameters from json 
 */ 
Lander.prototype.addStabilizers = function (params) {
  params.forEach((stab) => {
    let s = new Stabilizer(stab);
    s.x = stab.x;
    s.y = stab.y;
    if (stab.rotation) {
      s.rotation = stab.rotation;
    }
    this.addChild(s);
    this.stabilizers.push(s);
  });
};

/**
 * the refresh loop
 */
Lander.prototype.update = function () {
  // useless ??
};

/**
 * hide flag
 */
Lander.prototype.hideFlag = function () {
  this.flag.visible = false;
};
/**
 * show flag
 */
Lander.prototype.showFlag = function () {
  this.flag.visible = true;
};

/**
 * hide reactor sprite
 */
Lander.prototype.hideReactor = function () {
  this.reactor.visible = false;
};
/**
 * show reactor sprite
 */
Lander.prototype.showReactor = function () {
  this.reactor.visible = true;
};


/**
 * hide right Stabilizers sprite
 */
Lander.prototype.hideStabilizersRight = function () {
  for (let s = 0; s < this.stabilizers.length / 2; s++) {
    const stab = this.stabilizers[s];
    stab.visible = false;
  }
};

/**
 * show right Stabilizers sprite
 */
Lander.prototype.showStabilizersRight = function () {
  for (let s = 0; s < this.stabilizers.length / 2; s++) {
    const stab = this.stabilizers[s];
    stab.visible = true;
  }
};


/**
 * hide left Stabilizers sprite
 */
Lander.prototype.hideStabilizersLeft = function () {
  for (let s = this.stabilizers.length / 2; s < this.stabilizers.length; s++) {
    const stab = this.stabilizers[s];
    stab.visible = false;
  }
};

/**
 * show left Stabilizers sprite
 */
Lander.prototype.showStabilizersLeft = function () {
  for (let s = this.stabilizers.length / 2; s < this.stabilizers.length; s++) {
    const stab = this.stabilizers[s];
    stab.visible = true;
  }
};
