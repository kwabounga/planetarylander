function Lander(stage,params) {

  this.params = params;
  PIXI.extras.AnimatedSprite.call(this, [PIXI.Texture.from(this.params.sprite)]);
  this.anchor.set(0.5);
  this.sprites = [];

  this.addStabilizers(this.params.stabilizers);
  this.addReactor(this.params.reactor);
  this.addFlag(this.params.flag);
  this.loop = true;
  this.gotoAndPlay(0);
  stage.addChild(this);
}
Lander.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

// drapeau win
Lander.prototype.addFlag = function (params) {
    let f = new Flag(params);
  f.x = params.x;
  f.y = params.y;
  if(params.rotation){
    f.rotation = params.rotation
}
  this.addChild(f);
  this.sprites.push(f);
};
// réacteur
Lander.prototype.addReactor = function (params) {
  let r = new Reactor(params);
  r.x = params.x;
  r.y = params.y;
  this.addChild(r);
  this.sprites.push(r);
};
// stabilisateurs
Lander.prototype.addStabilizers = function (params) {
 params.forEach(stab => {
    let s = new Stabilizer(stab);
    s.x = stab.x;
    s.y = stab.y;
    if(stab.rotation){
        s.rotation = stab.rotation
    }
    this.addChild(s);
    this.sprites.push(s);
 });
};

// update
Lander.prototype.update = function () {
  this.sprites.forEach((sprite) => {
    sprite.update();
  });
};
