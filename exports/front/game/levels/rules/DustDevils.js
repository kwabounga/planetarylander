function DustDevils (type, params) {
  this.type = type;
  this.params = params;
  this.sprite = this.createSprite(this.params.size);
  this.body = this.createBody(this.params);
  this.wireframe = this.createWireFrame(this.params.size, this.params.dustPart);
  this.tween;
}
/**
 * debug wireframe
 */
DustDevils.prototype.createWireFrame = function (size, dustPart) {
  let vSet = [
    { "x": -(dustPart.w*0.5)/2, "y": 0 },
    { "x": -dustPart.w/2, "y": -(dustPart.h*size) },
    { "x": dustPart.w/2, "y": -(dustPart.h*size) },
    { "x": (dustPart.w*0.5)/2, "y": 0 }
  ]
  return Tools.wireFrameFromVertex(0, 0, vSet);
}
/**
 * gsap tween
 */
DustDevils.prototype.createTween = function (params) {
  const me = this;
  return gsap.fromTo(
    me.body.position,
    {
      x: 0,
      duration: params.duration,
      repeat: params.repeat,
      yoyo: true,
      repeatRefresh: true,
      ease: "sine.inOut",
    },
    {
      x: 800,
      duration: params.duration,
      repeat: params.repeat,
      yoyo: true,
      repeatRefresh: true,
      ease: "sine.inOut",
    }
  );
}
/**
 * Pixi animated Sprite
 */
DustDevils.prototype.createSprite = function (size=10) {
  let c = new PIXI.Sprite();
  c.anchor.set(0.5);
  for (let i = 0; i < size; i++) {
    // calculate to review
    let scaleX = (((i+1)/size)*0.5)+0.5;
    State.getInstance().log(scaleX);
    let s = this.getDDPart({x:scaleX,y:1}) ;
    c.addChild(s);
    s.y = i * -this.params.dustPart.h;
  }
  let p = this.getProjection();
  c.addChild(p);
  c.filters = [new PIXI.filters.BlurFilter(2,3,3)];
  return c;
}

DustDevils.prototype.getProjection = function () {
  const me = this;
  let s = new PIXI.extras.AnimatedSprite(Tools.getAnimationLoop('dust_projections',1,4))
  s.anchor.set(0.5,1);
  s.ticker = PIXI.ticker.shared;
	s.ticker.speed = 0.25;
  s.gotoAndPlay(Tools.randomBetween(0,4));
  
  // gsap.fromTo(s, {x:0,duration:0.5,repeat:-1,yoyo:true},{x:()=>{return Tools.randomBetween(-me.params.gap,me.params.gap)},duration:()=>{return Tools.randomBetween(0.5,1)},repeat:-1,repeatRefresh: true,yoyo:true});
  return s;
}
DustDevils.prototype.getDDPart = function (scale = {x:1,y:1}) {
  const me = this;
  let s = new PIXI.extras.AnimatedSprite(Tools.getAnimationLoop('dust',1,4))
  s.anchor.set(0.5);
  s.ticker = PIXI.ticker.shared;
	s.ticker.speed = 0.25;
  s.gotoAndPlay(Tools.randomBetween(0,4));
  s.scale = scale;
  gsap.fromTo(s, {x:0, duration:0.5, repeat:-1, yoyo:true},{x:()=>{return Tools.randomBetween(-me.params.gap,me.params.gap)},duration:()=>{return Tools.randomBetween(0.5,1)},repeat:-1,repeatRefresh: true,yoyo:true});
  return s;
}
/**
 * Matter Body
 */
DustDevils.prototype.createBody = function (params) {
  let vSet = [
    { "x": -(params.dustPart.w*0.5)/2, "y": 0 },
    { "x": -params.dustPart.w/2, "y": -(params.dustPart.h*params.size) },
    { "x": params.dustPart.w/2, "y": -(params.dustPart.h*params.size) },
    { "x": (params.dustPart.w*0.5)/2, "y": 0 }
  ]
  
  let b = Matter.Bodies.fromVertices(params.position.x, params.position.y, vSet, {isStatic: true, isSensor: true})
  // let b = Matter.Bodies.fromVertices(0, 0, vSet, {isStatic: true, isSensor: true})
  // this.params.partHeight
  return b;
}
// initialization 
DustDevils.prototype.init = function () {
  this.body.position = {x:400,y:300} 
  // this.body.position = this.params.position;
  this.sprite.position = this.params.position;
  this.wireframe.position = this.params.position;
  this.tween = this.createTween(this.params);
}
// loop update
DustDevils.prototype.update = function () {

  
}

