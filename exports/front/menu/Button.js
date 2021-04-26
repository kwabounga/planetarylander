
/**
 * 
 * @param {int} index the button index relative to the level to start
 * @param {Point} position the position of the current button
 * @class PIXI.Container
 */
function Button(index,position) {
  PIXI.Container.call(this)
  this.index = index;
  this.pos = position;
  const me = this;
  this.hiddenPos = {x:this.pos.x-800, y:this.pos.y};
  this.bt = new ButtonSprite(index+1)//new PIXI.Sprite(PIXI.Texture.from("ui_button0000"))
  this.bt.on('click', (this.emit.bind(this)))
  this.bt.on('mouseover', ()=>{
    me.bt.overed()
  })
  this.bt.on('mouseout', ()=>{
    me.bt.outed()
  })
  this.bt.anchor.set(0.5);
  this.addChild(this.bt);
  this.body = this.addPhysic(position)
  this.starsSprites = this.createStars(this.body)

  this.comeIn()
  this.emitter = new PIXI.utils.EventEmitter();
  this.emitterContext = {id:this.index}
}
/**
 * proto
 */
Button.prototype = Object.create(PIXI.Container.prototype);

/**
 * Comein animation
 */
Button.prototype.comeIn = function(){
  const me = this;
  gsap.to(me.getBtPhysic().position,{x:(this.pos.x),duration:2, delay: ((me.index+1)*0.15), ease:'elastic.out(1, 0.5)'})
}
/**
 * the call to emit start level event
 */
Button.prototype.emit = function(){
  this.emitter.emit('out',this.emitterContext )
}

/**
 * come out animation
 */
Button.prototype.comeOut = function(){
  const me = this;
  gsap.to(me.getBtPhysic().position,{x:(this.pos.x+800),duration:1/*, delay: ((me.index+1)*0.15)*/, ease:'elastic.in(1, 0.75)'})
}

/**
 * Add the physic for this button
 * create a composite ( container )
 * add
 * - rigid static body
 * - 3 constaints
 * - 3 'start' bodies 
 * @returns {Matter.Composite} to add it in the physic world
 */
Button.prototype.addPhysic = function() {
  let comp = Matter.Composite.create();
  let anchor = Matter.Bodies.circle(this.hiddenPos.x,this.pos.y,5,{isStatic:true,label:'button',collisionFilter: { group: this.index }});
  Matter.Composite.add(comp, [anchor]);
  // Matter.Composite.add(comp, [anchor,constraint]);
  let star1 = Matter.Bodies.polygon(this.hiddenPos.x-30,this.pos.y+40,5,20,{label:'star1',density:10,restitution:0,collisionFilter: { group: this.index }});
  let star2 = Matter.Bodies.polygon(this.hiddenPos.x,this.pos.y+50,5,20,{label:'star2',density:10,restitution:0,collisionFilter: { group: this.index }});
  let star3 = Matter.Bodies.polygon(this.hiddenPos.x+30,this.pos.y+40,5,20,{label:'star3',density:10,restitution:0,collisionFilter: { group: this.index }});
  let constraint1 = this.createConstraint(anchor,star1);
  let constraint2 = this.createConstraint(anchor,star2);
  let constraint3 = this.createConstraint(anchor,star3);
  
  Matter.Composite.add(comp, [star1, constraint1]);
  Matter.Composite.add(comp, [star2, constraint2]);
  Matter.Composite.add(comp, [star3, constraint3]);
  return comp;

}

/**
 * Matter.Constaint Factory for the stars
 * @param {Matter.body} bodyA the firt body
 * @param {Matter.body} bodyB the second body to link
 * @returns Matter.Constraint
 */
Button.prototype.createConstraint = function(bodyA, bodyB) {
  return Matter.Constraint.create({
    bodyA: bodyA,
    pointA: { x: 0, y: 0 },
    bodyB: bodyB,
    pointB: { x: 0, y: -5 },
    stiffness: 0.6,
  });
}
/**
 * 
 * @param {Matter.Container} body the physic bodies reference of the button and stars 
 * @returns an Array of stars sprites
 */
Button.prototype.createStars = function(body) {
  let starsSprite = []
  let regEx = new RegExp('star')
  let starsB = body.bodies.filter(b => regEx.test(b.label))
  starsB.forEach(star => {
    let sSprite = new PIXI.Sprite( PIXI.Texture.from("ui_star0000"))
    starsSprite.push(sSprite)
    sSprite.anchor.set(0.5)
    sSprite.position = star.position;
    this.addChild(sSprite)
  });
  return starsSprite
}


/**
 * the refresh loop 
 */
Button.prototype.update = function (){
  const me = this  
  let starsB = this.getStarsPhysic();
  starsB.forEach((star,i) => {
    me.starsSprites[i].position = star.position;
    me.starsSprites[i].rotation = star.angle;
  });
  
  me.bt.position = this.getBtPhysic().position
  me.bt.rotation = this.getBtPhysic().angle
}

/**
 * Accessor for the physic body of the button
 * @returns Matter.body the button body
 */
Button.prototype.getBtPhysic = function(){
  let regEx2 = new RegExp('button')
  let buttonB = this.body.bodies.filter(b => regEx2.test(b.label));
  return buttonB[0];
}
/**
 * Accessor for the physic stars
 * @returns an Array of Physic stars
 */
Button.prototype.getStarsPhysic = function(){
  let regEx = new RegExp('star')
  let starsB = this.body.bodies.filter(b => regEx.test(b.label))
  return starsB;
}