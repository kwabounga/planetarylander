/**
 * Create the Menu
 * @param {PIXI.Container} stage the PIXI stage
 * @param {Matter.Engine} engine the MatterJs engine
 * 
 * @class PIXI.Container
 */
function Menu(stage,engine) {

  PIXI.Container.call(this);
  this.state = State.getInstance();
  this.engine = engine;
  this.emitter = new PIXI.utils.EventEmitter();
  
  this.bodies = [];
  this.sprites = [];
  this.bg;
  let txt = this.state.menuData.bg[Tools.getHash()].quote.replace(/@/g,'"');
  this.quote = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 30,
    color: "#fffafa",
    text: txt,
    x: 400,
    y: 40,
  },true)
  let txtTitle = this.state.menuData.bg[Tools.getHash()].title.replace(/@/g,'"');
  this.title = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 50,
    color: this.state.menuData.bg[Tools.getHash()].tint,
    text: txtTitle,
    x: 400,
    y: 540,
  },true)
  // TODO GET WORLD ID IN OTHER WAY
  this.showMenu(this.state.menuData.worlds.indexOf(Tools.getHash()));
  this.addChild(this.quote);
  this.addChild(this.title);
  stage.addChild(this)
}
/**
 * proto
 */
Menu.prototype = Object.create(PIXI.Container.prototype)

/**
 * Menu construction
 * Set The Bg and create the buttons
 * Create Matter bodies
 * @param {int} worldID the worldId to display
 */
Menu.prototype.showMenu = function (worldID = 0) {
  const me = this
  me.bg = new MenuBg(this.state.menuData.worlds[worldID]);
  me.addChild(me.bg)
  for (let i = 0; i < 10; i++) {
    let position = this.getPosition(i)
    let button = new Button(i,position);
    this.sprites.push(button);
    this.addChild(button);
    this.bodies.push(button.body);
    button.emitter.on('out',me.launchLevel.bind(this));
    
  }
  
  Matter.World.add(me.engine.world, me.bodies);
};


/**
 * #launchLevel
 * launch the menu quit-animation, then emit the start event  with context {id:theLevelIdToStart}
 * @param {object} context the object context 
 */
Menu.prototype.launchLevel = function (context) {
  const me = this;
  console.log(context)

  me.sprites.forEach((b)=>{
    b.comeOut()
  })
  gsap.to(me.bg.position,{x:(me.bg.position.x+800),duration:1,delay:.5, ease:'power4.in',onComplete:me.quitToLevel.bind(me), onCompleteParams:[context]})

}

/**
 * 
 * @param {object} context the context for the start event {id:theLevelIdTOStart}
 */
Menu.prototype.quitToLevel = function (context) {
 console.log('quitToLevel', context);
 this.emitter.emit('start',context)
}

/**
 * Get the position of the button
 * @param {int} index the id of the button
 * @returns {Point} the {x,y} position of the button
 */
Menu.prototype.getPosition = function (index) {
  let margin = 50;
  let spaceLeft = { w: (800 - margin * 2)/5, h: (600 - margin * 2)/3 };
  let c = ((index) % 5)
  // console.log(c)
  let r = ((index) > 4 ? 2 : 1)
  return {x:(spaceLeft.w-(margin/2))+(c*spaceLeft.w ), y:(r*spaceLeft.h ) +(margin/2) }
}


/**
 * Display refreshing loop
 */
Menu.prototype.update = function(){
  this.sprites.forEach((s)=>{
    s.update()
  })
}
