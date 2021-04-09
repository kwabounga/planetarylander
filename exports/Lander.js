function Lander(stage, params) {
  this.params = params;
  PIXI.extras.AnimatedSprite.call(this, [
    PIXI.Texture.EMPTY
  ]);
  //   this.anchor.set(0.5);
  this.stabilizers = [];
  this.reactor;
  this.shell;
  this.flag;

  this.addStabilizers(this.params.stabilizers);
  this.addReactor(this.params.reactor);
  this.addShell(this.params.sprite);
  this.addFlag(this.params.flag);
  //   this.loop = true;
  this.gotoAndPlay(0);
  stage.addChild(this);
  // console.log('lander:',this);
  // const me = this;
  // this.interactive = true;
  //   this.on('click', ()=>{
  //     console.log('click');
  //     // this.showFlag()

  //     })
}
Lander.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

// drapeau win
Lander.prototype.addShell = function (sprite) {
  let s = new PIXI.Sprite(PIXI.Texture.from(sprite));
  this.addChild(s);
  s.anchor.set(0.5);

  // console.log('addShell',s);
  // this.sprites.push(s)
  this.shell = s;
};
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
// réacteur
Lander.prototype.addReactor = function (params) {
  let r = new Reactor(params);
  r.x = params.x;
  r.y = params.y;
  this.addChild(r);
  this.reactor = r;
};
// stabilisateurs
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

// update
Lander.prototype.update = function () {
  // ici gerer le state
};

// flag Ok
Lander.prototype.hideFlag = function () {
  this.flag.visible = false;
};
Lander.prototype.showFlag = function () {
  this.flag.visible = true;
};
// Reactor Ok
Lander.prototype.hideReactor = function () {
  this.reactor.visible = false;
};
Lander.prototype.showReactor = function () {
  this.reactor.visible = true;
};

// Stabilizers Ok
Lander.prototype.hideStabilizersRight = function () {
  for (let s = 0; s < this.stabilizers.length / 2; s++) {
    const stab = this.stabilizers[s];
    stab.visible = false;
  }
};
Lander.prototype.showStabilizersRight = function () {
  for (let s = 0; s < this.stabilizers.length / 2; s++) {
    const stab = this.stabilizers[s];
    stab.visible = true;
  }
};

Lander.prototype.hideStabilizersLeft = function () {
  for (let s = this.stabilizers.length / 2; s < this.stabilizers.length; s++) {
    const stab = this.stabilizers[s];
    stab.visible = false;
  }
};
Lander.prototype.showStabilizersLeft = function () {
  for (let s = this.stabilizers.length / 2; s < this.stabilizers.length; s++) {
    const stab = this.stabilizers[s];
    stab.visible = true;
  }
};
