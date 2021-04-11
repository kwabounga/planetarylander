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
    me.addTerrain(data,levelParams.centerOfMass);
    if (me.callBack) {
        me.init();
        me.callBack();
      }
  });
};
Level.prototype.init = function () {
  this.state.log(this.terrain);
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
    me.state.log(pairs[0]);
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
  if(this.state.isDebug){
    this.lander.wireFrame.position = this.lander.body.position;
    this.lander.wireFrame.rotation = this.lander.body.angle; 
}
  this.lander.sprite.update();
};
Level.prototype.addTerrain = function (data,centerOfMass) {
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
    me.state.log("vertexSets:", vertexSets);
    let terrain = Matter.Bodies.fromVertices(
        centerOfMass.x,
        centerOfMass.y,
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
  this.state.log("ADD Terrain");
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
Level.prototype.wireFrameFromVertex = function (x,y,vertexSets,centered = false , color="#86f11c") {
    let vSet = vertexSets.flat();
    var wireFrame = new PIXI.Graphics();
    wireFrame.lineStyle(1, color.replace("#", "0x"),1 );
    wireFrame.moveTo( vSet[0].x, vSet[0].y );
    // wireFrame.moveTo( 0, 0 );
    vSet.forEach(v => {
        wireFrame.lineTo( v.x, v.y);
    });
    wireFrame.lineTo( vSet[0].x, vSet[0].y );
    // wireFrame.lineTo( x, y );
    // wireFrame.lineTo( 0, 0 );
    wireFrame.lineTo( vSet[1].x, vSet[1].y );
    wireFrame.endFill();
    // wireFrame.pivot = {};
    if(centered){
        let sizeW = {x:Infinity,y:-Infinity};
        let sizeH = {x:Infinity,y:-Infinity};

        vSet.map((v)=>{
            // width
            sizeW.x = Math.min(sizeW.x,v.x)
            sizeW.y = Math.max(sizeW.y,v.x)
            // height
            sizeH.x = Math.min(sizeH.x,v.y)
            sizeH.y = Math.max(sizeH.y,v.y)
        })
        let width = sizeW.y//-sizeW.x;
        let height = sizeH.y//-sizeH.x;
        this.state.log('CENTERIZATION:', sizeW,sizeH, width, height)
        wireFrame.pivot = {x:(width/2)+sizeW.x,y:(height/2)+sizeH.x}
    } 
    return wireFrame
}
Level.prototype.addLander = function () {
    this.state.log("ADD LANDER");
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
      wireFrame = me.wireFrameFromVertex(params.x, params.y, params.vertices, true, "#08fff2");
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
      wireFrame = me.wireFrameFromVertex(params.x, params.y, vertexSet,true, "#08fff2");
 }
    
    // adding box to the bodies array
    //me.bodies.push(box);
    me.state.log('LANDER BODY',box);
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
  this.state.log(l.sprite);
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
  this.state.log('Terrain Physic:',this.terrain.body)
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
    this.state.log("adding key Events");

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
      me.state.log("EXIT PAUSE");
    } else {
       // this.state.log(me.engine);
      // cancelAnimationFrame(me.loopID);
      me.state.isPause = true;
      me.state.log("ENTER PAUSE");
    }
  };

  this.keyLeft.press = () => {
    me.state.log("keyLeft pressed");
    me.lander.sprite.showStabilizersLeft();
  };
  this.keyLeft.release = () => {
    me.state.log("keyLeft Released");
    me.lander.sprite.hideStabilizersLeft();
  };
  this.keyRight.press = () => {
    me.state.log("keyRight pressed");
    me.lander.sprite.showStabilizersRight();
  };
  this.keyRight.release = () => {
    me.state.log("keyRight Released");
    me.lander.sprite.hideStabilizersRight();
  };

  this.keyUp.press = () => {
    me.state.log("Up pressed");
    me.lander.sprite.showReactor();
  };
  this.keyUp.release = () => {
    me.state.log("Up Released");
    me.lander.sprite.hideReactor();
  };
};
