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
        y:0
     },
     sprite:{
        sprite: "landerLunar0000",
        reactor: { sprite: "mcReactor", x: -12, y: 22 },
        stabilizers: [
          { sprite: "mcPropulsor", x: -24, y: 7, rotation: 0 },
          { sprite: "mcPropulsor", x: 24, y: 7, rotation: 180 },
        ],
        flag: { sprite: "mcFlag", x: -69, y: -4, rotation: -0 },
      }
 }
//   var texture = PIXI.Texture.from("landerLunar0000");
  // var shape = new PIXI.Graphics();
  // shape.beginFill(0xCC5533);
  // shape.lineStyle(1, 0xFFFFFF);
  // shape.drawRect(0, 0, 40, 40);
  // var texture2 = shape.generateCanvasTexture();

  //   function SpriteObject() {
  //     // create a new Sprite using the texture
  //     var bunny = new PIXI.Sprite(texture);
  //     // real size of frame's sprite
  //     console.log(bunny._texture._frame.width,bunny._texture._frame.height);
  //     // center the sprite's anchor point
  //     bunny.anchor.x = 0.5;
  //     bunny.anchor.y = 0.5;
  //     // move the sprite to the center of the screen
  //     bunny.position.x = 200;
  //     bunny.position.y = 150;

  //     me.stage.addChild(bunny);
  //     return bunny;
  //   }

  function PhysicsObject(params) {
    // create two boxes and a ground
    var x, y, scale;
    // position at start
    x = params.x;
    y = params.y;
    // size of the box (square)
    scale = Math.random() * 20 + 20;
    console.log("PhysicsObject: ", x, y, scale, scale);
    var box = me.Bodies.rectangle(x, y, scale, scale);
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
