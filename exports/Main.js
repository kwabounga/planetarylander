function Main(data) {

  this.loader = document.getElementById("loader");
  this.view = document.getElementById("game-canvas");

  this.data = data;
  this.Engine = Matter.Engine;
  this.World = Matter.World;
  this.Bodies = Matter.Bodies;
  this.Mouse = Matter.Mouse;
  this.Events = Matter.Events;
  this.MouseConstraint = Matter.MouseConstraint;

  this.engine = this.Engine.create();
  this.ground = this.Bodies.rectangle(400, 610, 810, 60, { isStatic: true, });
  this.bodies = [];
  this.bodies.push(this.ground);
  
  
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(800, 600, {
    backgroundColor: "#3a3a41".replace("#", "0x"),
    antialias: true,
    resolution: window.devicePixelRatio,
    view: this.view,
  });

 
  this.lander;
  
  this.loadSpriteSheet();

  this.loopID;
}

Main.prototype.showCanvas = function(){
  this.view.style="";
  this.loader.style = "display: none;"
}
Main.prototype.showLoader = function(){
  this.view.style="display: none;";
  this.loader.style = ""
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
 


  this.engine.world.gravity.scale = 0.0005
  // add all of the bodies to the world
  this.World.add(this.engine.world, this.bodies);

  // mouse constraints
  // this.addMouseConstraint();

  // controls
    this.addKeysEvents();
  // collisions
    this.addCollisions();
  // loader to game swapper
    this.showCanvas()

  // run the engine  
  this.loopID = requestAnimationFrame(this.update.bind(this));
  
};



Main.prototype.addCollisions = function () {
  
  const me = this;
  this.Events.on(me.engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    console.log(pairs[0]);
    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        if (pair.bodyA === me.ground ) {
            me.win();
        } else if (pair.bodyB === me.ground) {
            me.win();
        }
    }
});
};
Main.prototype.win = function () {
    this.lander.sprite.showFlag();
    this.lander.sprite.hideReactor();
    this.lander.sprite.hideStabilizersLeft();
    this.lander.sprite.hideStabilizersRight();
    this.removeKeyEvents();
}

// only for test
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

  // exemple : cf JSON.parse(./data/moon.json).lander
//  let paramsLander = {
//      physic:{
//         x:400,
//         y:0,
//         width:38,
//         height:76
//      },
//      sprite:{
//         sprite: "landerLunar0000",
//         reactor: { sprite: "mcReactor", x: 1.5, y: 25 },
//         stabilizers: [
//           { sprite: "mcPropulsor", x: -24, y: 7, rotation: 0 },
//           { sprite: "mcPropulsor", x: 24, y: 7, rotation: 180 },
//         ],
//         flag: { sprite: "mcFlag", x: -69, y: -4, rotation: -0 },
//       }
//  }

  function PhysicsObject(params) {
    // create the box for lander
    
    var box = me.Bodies.rectangle(params.x, params.y, params.width, params.height,{rot:0});
    // adding box to the bodies array
    me.bodies.push(box);
    console.log(box);
    return box;
  }

  var createLander = function () {
    return {
      sprite: new Lander(me.stage, me.data.lander.sprite),
      body: new PhysicsObject(me.data.lander.physic),
    };
  };

  let l = createLander();
  console.log(l.sprite);
  this.lander = l;
};
Main.prototype.update = function () {
  // using pixi loop for Matter Engine updating 
  Matter.Engine.update(this.engine)
  // console.log("this.update")
    const m = this
    if(this.keyUp && this.keyRight && this.keyLeft){

        if(this.keyUp.isDown){
            Matter.Body.setVelocity(m.lander.body,{x:m.lander.body.velocity.x,y:(m.lander.body.velocity.y-0.5)})
          
        }
        if(this.keyRight.isDown){
          Matter.Body.setVelocity(m.lander.body,{x:m.lander.body.velocity.x+0.2,y:(m.lander.body.velocity.y)})
          Matter.Body.setAngle(m.lander.body, m.lander.body.angle+0.002);
        }
        if(this.keyLeft.isDown){
          Matter.Body.setVelocity(m.lander.body,{x:m.lander.body.velocity.x-0.2,y:(m.lander.body.velocity.y)})
          Matter.Body.setAngle(m.lander.body, m.lander.body.angle-0.002);
        }
    }

  
    this.lander.sprite.position = this.lander.body.position
    this.lander.sprite.rotation = this.lander.body.angle
    this.lander.sprite.update();

  // render the container
  this.renderer.render(this.stage);
  this.loopID = requestAnimationFrame(this.update.bind(this));
};



Main.prototype.removeKeyEvents = function () {
    this.keyUp.unsubscribe();
    this.keyRight.unsubscribe();
    this.keyLeft.unsubscribe();

    this.keyUp = null;
    this.keyRight = null;
    this.keyLeft = null;
}
Main.prototype.addKeysEvents = function () {
    console.log("adding key Events");

    this.keyUp = keyboard("ArrowUp");// propulsion
    this.keyRight = keyboard("ArrowRight"); // direction
    this.keyLeft = keyboard("ArrowLeft"); // direction
    this.keySpace = keyboard(" "); // pause
    
    const me = this;
  
    
    this.keySpace.release = () => {
      // console.log("SPACE Released");
      if(me.isPause){
        me.loopID = requestAnimationFrame(me.update.bind(me));
        me.isPause = false;
        console.log('EXIT PAUSE');
      } else{
        console.log(me.engine);
        cancelAnimationFrame(me.loopID);
        me.isPause = true;
        console.log('ENTER PAUSE');
      }
      
    };

    this.keyLeft.press = () => {
      console.log("keyLeft pressed");
      me.lander.sprite.showStabilizersLeft();
      
    }; 
    this.keyLeft.release = () => {
      console.log("keyLeft Released");
      me.lander.sprite.hideStabilizersLeft();
    };
    this.keyRight.press = () => {
      console.log("keyRight pressed");
      me.lander.sprite.showStabilizersRight();
      
    };
    this.keyRight.release = () => {
      console.log("keyRight Released");
      me.lander.sprite.hideStabilizersRight();
    };

    this.keyUp.press = () => {
      console.log("Up pressed");
      me.lander.sprite.showReactor()
      
    };
    this.keyUp.release = () => {
      console.log("Up Released");
      me.lander.sprite.hideReactor()
    };
  
    
  }