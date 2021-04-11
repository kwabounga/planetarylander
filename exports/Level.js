function Level(stage, engine, data, callBack = null) {
  this.engine = engine;
  this.stage = stage;
  this.data = data;
  this.isGameOver = false;
  // PIXI.Container.call(this);
  this.state = State.getInstance();

  this.lander;
  this.terrain;
  this.landZones = [];
  this.stars = [];
  this.bonus = [];
  this.malus = [];
  this.callBack = callBack;
  //   this.addLander();
  //   // todo: gerer les landzones ds les json
  //   this.addlandZones();

  //   // controls
  //   this.addKeysEvents();

  //   // collisions
  //   this.addCollisions();
  this.loadTerrain(this.data.levels[this.state.game.currentLevel]);
}
Level.prototype.loadTerrain = function (levelParams) {
  const me = this;
  Tools.ajaxGet(levelParams.terrain, (data) => {
    // let d = JSON.parse(data);
    me.addTerrain(data);
    if (me.callBack) {
        me.init();
        me.callBack();
      }
  });
};
Level.prototype.init = function () {
  console.log(this.terrain);
  this.addLander();
  // todo: gerer les landzones ds les json
  this.addlandZones();

  // controls
  this.addKeysEvents();

  // collisions
  this.addCollisions();
};
// todo: mette tout dans le container et croiser les doigts
// Level.prototype = Object.create(PIXI.Container.prototype)
Level.prototype.addCollisions = function () {
  const me = this;
  Matter.Events.on(me.engine, "collisionStart", function (event) {
    var pairs = event.pairs;
    console.log(pairs[0]);
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];

      me.landZones.forEach((lZone) => {
        if (pair.bodyA === lZone) {
          me.win();
        } else if (pair.bodyB === lZone) {
          me.win();
        }
      });
    }
  });
};

Level.prototype.win = function () {
  this.removeKeyEvents();
  this.lander.sprite.showFlag();
  this.lander.sprite.hideReactor();
  this.lander.sprite.hideStabilizersLeft();
  this.lander.sprite.hideStabilizersRight();
  this.isGameOver = true;
};

Level.prototype.update = function () {
  const m = this;
  if (this.state.keyUp && this.state.keyRight && this.state.keyLeft) {
    if (this.state.keyUp.isDown) {
      Matter.Body.setVelocity(m.lander.body, {
        x: m.lander.body.velocity.x,
        y: m.lander.body.velocity.y - m.data.lander.motor.reactorPower,
      });
      this.state.game.fuelCurrent -= m.data.lander.motor.fuelConsumption;
    }
    if (this.state.keyRight.isDown) {
      Matter.Body.setVelocity(m.lander.body, {
        x: m.lander.body.velocity.x + m.data.lander.motor.stabilizersPower,
        y: m.lander.body.velocity.y,
      });
      Matter.Body.setAngle(m.lander.body, m.lander.body.angle + 0.002);
    }
    if (this.state.keyLeft.isDown) {
      Matter.Body.setVelocity(m.lander.body, {
        x: m.lander.body.velocity.x - m.data.lander.motor.stabilizersPower,
        y: m.lander.body.velocity.y,
      });
      Matter.Body.setAngle(m.lander.body, m.lander.body.angle - 0.002);
    }
  }
  this.state.game.speedX = m.lander.body.velocity.x;
  this.state.game.speedY = m.lander.body.velocity.y;

  this.lander.sprite.position = this.lander.body.position;
  this.lander.sprite.rotation = this.lander.body.angle;
  this.lander.sprite.update();
};
Level.prototype.addTerrain = function (data) {
  const me = this;
  function PhysicsObject(data) {
    // console.log("loadTerrain:", data);
    let root = new window.DOMParser().parseFromString(data, "image/svg+xml");
    var select = function (root, selector) {
        return Array.prototype.slice.call(root.querySelectorAll(selector));
    };
    let paths = select(root, "path");
    let vertexSets = paths.map(function (path) {
        return Matter.Svg.pathToVertices(path, 5);
    });
    console.log("vertexSets:", vertexSets);
    let terrain = Matter.Bodies.fromVertices(
      360,
      1290,
      vertexSets,
      {
        isStatic: true,
        render: {
            fillStyle: '#060a19',
            strokeStyle: '#060a19',
            lineWidth: 1
        }
      },
      false
    );
    
    let wireFrame = me.wireFrameFromVertex(360, 1290,vertexSets);
    return {terrain,wireFrame};
  }
  console.log("ADD Terrain");
  var createTerrain = function (data) {
      let b = new PhysicsObject(data);
    //   me.stage.addChild(b.wireFrame)
    return {
      sprite: new PIXI.Sprite( PIXI.Texture.from(`terrain${me.state.game.currentLevel}`)),
      body: b.terrain,  
      wireFrame: b.wireFrame,  
    };
  };
  me.terrain = createTerrain(data)
  this.stage.addChild(me.terrain.sprite)
  if(me.state.isDebug){
      this.stage.addChild(me.terrain.wireFrame)
  }
  
  
};
Level.prototype.wireFrameFromVertex = function (x,y,vertexSets) {
    let vSet = vertexSets.flat();
    var wireFrame = new PIXI.Graphics();
    wireFrame.lineStyle(1, "#86f11c".replace("#", "0x"),1 );
    wireFrame.moveTo( x, y );
    vSet.forEach(v => {
        wireFrame.lineTo( v.x, v.y);
    });
    wireFrame.endFill();
    return wireFrame
}
Level.prototype.addLander = function () {
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
      let box;
      let wireFrame=[{x:0,y:0}];
    // create the box for lander
 if(params.vertices){
    box = Matter.Bodies.fromVertices(
        params.x,
        params.y,
        params.vertices,
        {
          rot: 0,
  
          density: params.density,
          frictionAir: params.frictionAir,
          friction: params.friction,
          restitution: params.restitution,
          render: {
            fillStyle: '#f19648',
            strokeStyle: '#f19648',
            lineWidth: 1
        }
        }, false
      );
      wireFrame = me.wireFrameFromVertex(params.x, params.y, params.vertices);
 } else{
    box = Matter.Bodies.rectangle(
        params.x,
        params.y,
        params.width,
        params.height,
        {
          rot: 0,
  
          density: params.density,
          frictionAir: params.frictionAir,
          friction: params.friction,
          restitution: params.restitution,
        }
      );
      // vertices from rectangle
      let vertexSet = [{x:params.x,y:params.y},{x:params.width,y:params.y},{x:params.width,y:params.height},{x:params.x,y:params.height},{x:params.x,y:params.y}]
      wireFrame = me.wireFrameFromVertex(params.x, params.y, vertexSet);
 }
    
    // adding box to the bodies array
    //me.bodies.push(box);
    console.log('LANDER BODY',box);
    return {box, wireFrame};
  }

  var createLander = function () {
      let b = new PhysicsObject(me.data.lander.physic);
    return {
      sprite: new Lander(me.stage, me.data.lander.sprite),
      body: b.box,
      wireFrame: b.wireFrame,
    };
  };
  let l = createLander();
  //me.stage.addChild(l.body)
  console.log(l.sprite);
  this.lander = l;
  if(me.state.isDebug){
    this.stage.addChild(this.lander.wireFrame)
}
};

Level.prototype.getLander = function () {
  return this.lander;
};

Level.prototype.addlandZones = function () {
  //todo loop with lands zones object
  let g = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  this.landZones.push(g);
};

Level.prototype.getLandZones = function () {
  return this.landZones;
};

Level.prototype.getAllBodiesInThisLevel = function () {
  let lz = this.getLandZones();
  let l = this.getLander().body;
  let t = this.terrain.body;
  console.log('TErain Physic:',this.terrain.body)
  return lz.concat(l).concat(t).flat();
};

Level.prototype.removeKeyEvents = function () {
  this.keyUp.unsubscribe();
  this.keyRight.unsubscribe();
  this.keyLeft.unsubscribe();
  // toto : synchro with state
  //   this.keyUp = null;
  //   this.keyRight = null;
  //   this.keyLeft = null;
};
Level.prototype.addKeysEvents = function () {
  console.log("adding key Events");

  this.keyUp = keyboard("ArrowUp"); // propulsion
  this.keyRight = keyboard("ArrowRight"); // direction
  this.keyLeft = keyboard("ArrowLeft"); // direction
  this.keySpace = keyboard(" "); // pause

  this.state.keyUp = this.keyUp;
  this.state.keyRight = this.keyRight;
  this.state.keyLeft = this.keyLeft;
  this.state.keySpace = this.keySpace;

  const me = this;

  this.keySpace.release = () => {
    // console.log("SPACE Released");
    if (me.state.isPause) {
      // me.loopID = requestAnimationFrame(me.update.bind(me));
      me.state.isPause = false;
      console.log("EXIT PAUSE");
    } else {
      console.log(me.engine);
      // cancelAnimationFrame(me.loopID);
      me.state.isPause = true;
      console.log("ENTER PAUSE");
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
    me.lander.sprite.showReactor();
  };
  this.keyUp.release = () => {
    console.log("Up Released");
    me.lander.sprite.hideReactor();
  };
};
