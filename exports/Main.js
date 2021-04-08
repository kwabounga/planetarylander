function Main() {
  this.Engine = Matter.Engine;
  this.World = Matter.World;
  this.Bodies = Matter.Bodies;
  this.Mouse = Matter.Mouse;
  this.MouseConstraint = Matter.MouseConstraint;

  this.engine = this.Engine.create();
  this.ground = this.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  this.bodies = [];
  this.bodies.push(this.ground);

  this.view = document.getElementById("game-canvas");
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(800, 600, {
    backgroundColor: 0xffffe0,
    antialias: true,
    resolution: window.devicePixelRatio,
    view: this.view,
  });

  //   this.bunnies = [];
  this.lander;

  this.loadSpriteSheet();
}
/**
 * sprite sheet loader
 */
Main.prototype.loadSpriteSheet = function () {
  console.log("LOAD");
  var loader = PIXI.loader;

  // loader.add("matrix", "./assets/matrix.fnt");
  loader.add("landersSpriteSheet", "./assets/landers.json");
  loader.once("complete", this.spriteSheetLoaded.bind(this));
  loader.load();
};
Main.prototype.spriteSheetLoaded = function () {
  console.log("LOADED");

  // todo: change this
  this.addLander();
  let test = new Flag({ sprite: "mcFlag", x: -69, y: -4, rotation: -0 })
  test.x=400;
  test.y=300;
  this.stage.addChild(test);
  test.play()



  // add all of the bodies to the world
  this.World.add(this.engine.world, this.bodies);

  //mouse constraints
  this.addMouseConstraint();

  // run the engine
  this.Engine.run(this.engine);
  requestAnimationFrame(this.update.bind(this));
};
Main.prototype.addMouseConstraint = function () {
  // add mouse control
  var mouse = this.Mouse.create(this.renderer.view),
    mouseConstraint = this.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
  this.World.add(this.engine.world, mouseConstraint);
  this.renderer.mouse = mouse;
};

Main.prototype.addLander = function () {
  console.log("ADD LANDER");
  const me = this;
 let paramsLander = {
     physic:{
        x:400,
        y:0,
        width:38,
        height:76
     },
     sprite:{
        sprite: "landerLunar0000",
        reactor: { sprite: "mcReactor", x: 1.5, y: 25 },
        stabilizers: [
          { sprite: "mcPropulsor", x: -24, y: 7, rotation: 0 },
          { sprite: "mcPropulsor", x: 24, y: 7, rotation: 180 },
        ],
        flag: { sprite: "mcFlag", x: -69, y: -4, rotation: -0 },
      }
 }

  function PhysicsObject(params) {
    // create the box for lander
    
    var box = me.Bodies.rectangle(params.x, params.y, params.width, params.height);
    // adding box to the bodies array
    me.bodies.push(box);
    console.log(box);
    return box;
  }

  var createLander = function () {
    return {
      sprite: new Lander(me.stage, paramsLander.sprite),
      body: new PhysicsObject(paramsLander.physic),
    };
  };

  let l = createLander();
  console.log(l.sprite);
  this.lander = l;
};
Main.prototype.update = function () {
  // console.log('UPDATE');
  const me = this;
  
//   for (var b in me.bunnies) {
//     me.bunnies[b].sprite.position = me.bunnies[b].body.position;
//     me.bunnies[b].sprite.rotation = me.bunnies[b].body.angle;
//   }
    this.lander.sprite.position = this.lander.body.position
    this.lander.sprite.rotation = this.lander.body.angle
    this.lander.sprite.update();

  // render the container
  this.renderer.render(this.stage);
  requestAnimationFrame(this.update.bind(this));
};
