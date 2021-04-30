function DustDevils (params) {
  this.params = params
  this.sprite = this.createSprite(this.params.size);
  this.body;
  this.tween;
  this.wireframe = this.createWireFrame(this.params.size);;

}
/**
 * gsap tween
 */
DustDevils.prototype.createWireFrame = function (size) {
  
}
DustDevils.prototype.createTween = function () {
  
}
/**
 * Pixi animated Sprite
 */
DustDevils.prototype.createSprite = function (size=10) {
  let c = new PIXI.Container();
  for (let i = 0; i < size; i++) {
    // calculate to review
    let scaleX = (((i+1)/size)*0.5)+0.5;
    console.log(scaleX);
    let s = this.getDDPart({x:scaleX,y:1}) ;
    c.addChild(s);
    s.y = i * -16
  }
  let p = this.getProjection()
  c.addChild(p);
  c.filters = [new PIXI.filters.BlurFilter(2,3,3)]
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
  gsap.fromTo(s, {x:0,duration:0.5,repeat:-1,yoyo:true},{x:()=>{return Tools.randomBetween(-me.params.gap,me.params.gap)},duration:()=>{return Tools.randomBetween(0.5,1)},repeat:-1,repeatRefresh: true,yoyo:true});
  return s;
}
/**
 * Matter Body
 */
DustDevils.prototype.createBody = function () {

}
// loop 
DustDevils.prototype.update = function () {

}

