function Menu(stage) {
  PIXI.Container.call(this);

  this.bodies = [];
  this.sprites = [];

  this.showMenu(0);
  stage.addChild(this)
}

Menu.prototype = Object.create(PIXI.Container.prototype)

Menu.prototype.showMenu = function (worldID = 0) {
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
    
  }
  
  
};



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
