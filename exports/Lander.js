function Lander(stage,params) {

  this.params = params;
  PIXI.extras.AnimatedSprite.call(this, [PIXI.Texture.EMPTY,PIXI.Texture.EMPTY,PIXI.Texture.EMPTY]);
//   this.anchor.set(0.5);
  this.stabilizers = [];
  this.reactor ;
  this.shell ;
  this.flag ;

  this.addShell(this.params.sprite);
  this.addStabilizers(this.params.stabilizers);
  this.addReactor(this.params.reactor);
  this.addFlag(this.params.flag);
//   this.loop = true;
  this.gotoAndPlay(0);
  stage.addChild(this);
  console.log('lander:',this);
  const me = this;
  this.interactive = true;
//   this.dirty = true;
  this.on('click', ()=>{
    console.log('click');
    // this.showFlag()
    
})
  
}
Lander.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

// drapeau win
Lander.prototype.addShell = function (sprite) {
    let s =  new PIXI.Sprite(PIXI.Texture.from(sprite))
    this.addChild(s)
    s.anchor.set(0.5);
    
    console.log('WHAT?',s);
    // this.sprites.push(s)
    this.shell = s;
}
Lander.prototype.addFlag = function (params) {
    let f = new Flag(params);
  f.x = params.x;
  f.y = params.y;
  if(params.rotation){
    f.rotation = params.rotation
}
  this.addChild(f);
  
  f.play();
  f.visible = false;
  this.flag = f;
};
// réacteur
Lander.prototype.addReactor = function (params) {
  let r = new Reactor(params);
  r.x = params.x;
  r.y = params.y;
  this.addChild(r);
//   r.play();
  this.reactor = r;
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
    this.stabilizers.push(s);
 });
};

// update
Lander.prototype.update = function () {
  // ic gerer le state avec l'etat des stabilizers et du reactor
};



// flag Ok
Lander.prototype.hideFlag = function(){
  this.flag.visible = false;
}
Lander.prototype.showFlag = function(){
  this.flag.visible = true;
}
