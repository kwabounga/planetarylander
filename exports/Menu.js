function Menu(stage,engine) {

  PIXI.Container.call(this);
  this.state = State.getInstance();
  this.engine = engine;
  this.bodies = [];
  this.sprites = [];
  this.bg;
  // TODO GET WORLD ID IN OTHER WAY
  this.showMenu(this.state.menuData.worlds.indexOf(Tools.getHash()));
  stage.addChild(this)
}

Menu.prototype = Object.create(PIXI.Container.prototype)

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
  gsap.to(me.bg.position,{x:(me.bg.position.x+800),duration:1,delay:.5, ease:'power4.in'})

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
