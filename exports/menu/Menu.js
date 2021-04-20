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

Menu.prototype = Object.create(PIXI.Container.prototype)

Menu.prototype.displayTitle = function (worldID = 0) {

}
Menu.prototype.showMenu = function (worldID = 0) {
  const me = this
  me.bg = new MenuBg(this.state.menuData.worlds[worldID]);
  me.addChild(me.bg)
  for (let i = 0; i < 10; i++) {
    let position = this.getPosition(i)
    let button = new Button(i,position);
    //button.position = position
    // if(i==0) {button.position = {x:400,y:50}}
    // if(i==1) {button.position = {x:400,y:400}}
    // if(i==2) {button.position = {x:400,y:400}}
    
    //this.bodies.push(button.body);
    this.sprites.push(button);
    this.addChild(button);
    this.bodies.push(button.body);
    button.emitter.on('out',me.launchLevel.bind(this));
    
  }
  
  Matter.World.add(me.engine.world, me.bodies);
};



Menu.prototype.launchLevel = function (context) {
  const me = this;
  console.log(context)

  me.sprites.forEach((b)=>{
    b.comeOut()
  })
  gsap.to(me.bg.position,{x:(me.bg.position.x+800),duration:1,delay:.5, ease:'power4.in',onComplete:me.quitToLevel.bind(me), onCompleteParams:[context]})

}
Menu.prototype.quitToLevel = function (context) {
 console.log('quitToLevel', context);
 this.emitter.emit('start',context)
}
Menu.prototype.getPosition = function (index) {
  let margin = 50;
  let spaceLeft = { w: (800 - margin * 2)/5, h: (600 - margin * 2)/3 };
  let c = ((index) % 5)
  // console.log(c)
  let r = ((index) > 4 ? 2 : 1)
  return {x:(spaceLeft.w-(margin/2))+(c*spaceLeft.w ), y:(r*spaceLeft.h ) +(margin/2) }
}

Menu.prototype.update = function(){
  this.sprites.forEach((s)=>{
    s.update()
  })
}
