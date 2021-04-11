/**
 *
 * @param {PIXI.Container} stage the stage
 * @param {Matter.Engine} engine the physic engine
 * @param {Object} data from json
 * @param {Function} callBack [optional]
 */
function Level(stage, engine, data, callBack = null) {
  PIXI.Container.call(this);
  this.engine = engine;
  this.stage = stage;
  this.data = data;
  this.isGameOver = false;
  this.state = State.getInstance();

  this.lander;
  this.terrain;
  this.landZones = [];
  this.stars = [];
  this.bonus = [];
  this.malus = [];
  this.callBack = callBack;

  this.stage.addChild(this);
  // TODO: gerer les landzones ds les json

  this.loadTerrain(this.data.levels[this.state.game.currentLevel]);
}

// todo: mette tout dans le container et croiser les doigts
Level.prototype = Object.create(PIXI.Container.prototype);

/**
 * load the current terrain (svg) then init and launch callback if any
 * @param {Object} levelParams from json levels
 */
Level.prototype.loadTerrain = function (levelParams) {
  const me = this;
  Tools.ajaxGet(levelParams.terrain, (data) => {
    // let d = JSON.parse(data);
    me.addTerrain(data, levelParams.centerOfMass);
    if (me.callBack) {
      me.init();
      me.callBack();
    }
  });
};

/**
 * initialization
 */
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

/**
 * hitTest for landing zones ..see for stars  / bonus / malus here ?
 */
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

/**
 * win
 */
Level.prototype.win = function () {
  // TODO: make condition for win or loose before call win
  this.removeKeyEvents();
  this.lander.sprite.showFlag();
  this.lander.sprite.hideReactor();
  this.lander.sprite.hideStabilizersLeft();
  this.lander.sprite.hideStabilizersRight();
  this.isGameOver = true;
};

/**
 *  update / game loop
 */
Level.prototype.update = function () {
  const m = this;

  if (this.state.keyUp && this.state.keyRight && this.state.keyLeft) {
    if (this.state.keyUp.isDown) {
      let landerRot = (m.lander.body.angle * 180) / Math.PI;
      let velY =
        -m.data.lander.motor.reactorPower *
        Math.cos((landerRot * Math.PI) / 180);
      let velX =
        -m.data.lander.motor.reactorPower *
        Math.sin((landerRot * Math.PI) / 180) *
        -1;
      m.state.log(landerRot, velY, velX);

      Matter.Body.applyForce(
        m.lander.body,
        { x: m.lander.body.position.x, y: m.lander.body.position.y },
        { x: velX / 200, y: velY / 200 }
      );
      this.state.game.fuelCurrent -= m.data.lander.motor.fuelConsumption;
    }
    if (this.state.keyRight.isDown) {
      Matter.Body.setAngularVelocity(
        m.lander.body,
        m.lander.body.angularVelocity + m.data.lander.motor.stabilizersPower
      );
    }
    if (this.state.keyLeft.isDown) {
      Matter.Body.setAngularVelocity(
        m.lander.body,
        m.lander.body.angularVelocity - m.data.lander.motor.stabilizersPower
      );
    }
  }
  this.state.game.speedX = m.lander.body.velocity.x;
  this.state.game.speedY = m.lander.body.velocity.y;

  this.lander.sprite.position = this.lander.body.position;
  this.lander.sprite.rotation = this.lander.body.angle;
  if (this.state.isDebug) {
    this.lander.wireFrame.position = this.lander.body.position;
    this.lander.wireFrame.rotation = this.lander.body.angle;
  }
  this.lander.sprite.update();
};

/**
 * create, set and add terrain
 * @param {SVG} data svg terrain raw data
 * @param {Point} centerOfMass  center of mass position point
 */
Level.prototype.addTerrain = function (data, centerOfMass) {
  const me = this;
  // create the physic object + wireframe
  function PhysicsObject(data) {
    // parsing svg object
    let root = new window.DOMParser().parseFromString(data, "image/svg+xml");
    var select = function (root, selector) {
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    };
    let paths = select(root, "path");
    // converting svg path to vertices set
    let vertexSets = paths.map(function (path) {
      return Matter.Svg.pathToVertices(path, 5);
    });
    me.state.log("vertexSets:", vertexSets);

    // creation of the physic object
    let terrain = Matter.Bodies.fromVertices(
      centerOfMass.x,
      centerOfMass.y,
      vertexSets,
      {
        isStatic: true,
        render: {
          fillStyle: "#060a19",
          strokeStyle: "#060a19",
          lineWidth: 1,
        },
      },
      false
    );

    // creation of the wireframe object
    let wireFrame = me.wireFrameFromVertex(360, 1290, vertexSets);
    return { terrain, wireFrame };
  }
  // creation of the obejct terrain  sprite + body + wireframe
  var createTerrain = function (data) {
    let b = new PhysicsObject(data);
    return {
      sprite: new PIXI.Sprite(
        PIXI.Texture.from(`terrain${me.state.game.currentLevel}`)
      ),
      body: b.terrain,
      wireFrame: b.wireFrame,
    };
  };

  me.terrain = createTerrain(data);
  this.addChild(me.terrain.sprite);

  // displaying wireframe on debug
  if (me.state.isDebug) {
    this.addChild(me.terrain.wireFrame);
  }
};

/**
 *
 * @param {number} x  position x
 * @param {number} y  position y
 * @param {Array} vertexSets set of vertices
 * @param {boolean} centered for set pivot point to the center of the object
 * @param {hexadecimal} color the color of wireframe lines
 * @returns {PIXI.Graphics} wireframe object
 */
Level.prototype.wireFrameFromVertex = function (
  x,
  y,
  vertexSets,
  centered = false,
  color = "#86f11c"
) {
  // recuperation d'un array de vertices
  let vSet = vertexSets.flat();

  // dessin des contours
  var wireFrame = new PIXI.Graphics();
  wireFrame.lineStyle(1, color.replace("#", "0x"), 1);
  wireFrame.moveTo(vSet[0].x, vSet[0].y);
  vSet.forEach((v) => {
    wireFrame.lineTo(v.x, v.y);
  });
  wireFrame.lineTo(vSet[0].x, vSet[0].y);
  wireFrame.lineTo(vSet[1].x, vSet[1].y);
  wireFrame.endFill();

  // replacement pour les landers
  if (centered) {
    let sizeW = { x: Infinity, y: -Infinity };
    let sizeH = { x: Infinity, y: -Infinity };

    vSet.map((v) => {
      // width
      sizeW.x = Math.min(sizeW.x, v.x);
      sizeW.y = Math.max(sizeW.y, v.x);
      // height
      sizeH.x = Math.min(sizeH.x, v.y);
      sizeH.y = Math.max(sizeH.y, v.y);
    });
    let width = sizeW.y; //-sizeW.x;
    let height = sizeH.y; //-sizeH.x;
    this.state.log("CENTERIZATION:", sizeW, sizeH, width, height);
    wireFrame.pivot = { x: width / 2 + sizeW.x, y: height / 2 + sizeH.x };
  }

  return wireFrame;
};

/**
 * create, set and add the lander
 */
Level.prototype.addLander = function () {
  this.state.log("ADD LANDER");
  const me = this;

  // cf JSON.parse(./data/moon.json) >> "lander" for the parameters

  // creation of the physic object and wireframe
  function PhysicsObject(params) {
    let box = new LanderBody(params);
    let wireFrame;
    // create the box for lander
    if (params.vertices) {
      wireFrame = me.wireFrameFromVertex(
        params.x,
        params.y,
        params.vertices,
        true,
        "#08fff2"
      );
    } else {
      // vertices from rectangle
      let vertexSet = [ { x: params.x, y: params.y }, { x: params.width, y: params.y }, { x: params.width, y: params.height }, { x: params.x, y: params.height }, { x: params.x, y: params.y }, ];
      wireFrame = me.wireFrameFromVertex(
        params.x,
        params.y,
        vertexSet,
        true,
        "#08fff2"
      );
    }
    me.state.log("LANDER BODY", box);

    return { box, wireFrame };
  }

  // Object Lander : sprite + body + wireframe
  var createLander = function () {
    let b = new PhysicsObject(me.data.lander.physic);
    return {
      sprite: new Lander(me, me.data.lander.sprite),
      body: b.box,
      wireFrame: b.wireFrame,
    };
  };

  this.lander = createLander();
  this.state.log(this.lander.sprite);

  // adding wireframe to renderer if debug
  if (me.state.isDebug) {
    this.addChild(this.lander.wireFrame);
  }
};

Level.prototype.getLander = function () {
  return this.lander;
};

Level.prototype.addlandZones = function () {
  //todo loop with lands zones object
  let g = Matter.Bodies.rectangle(400, 2000, 810, 60, { isStatic: true });
  if (this.state.isDebug) {
    let bw = new PIXI.Graphics();

    // Rectangle
    bw.lineStyle(2, 0xFEEB77, 1);
    bw.drawRect(0, 1970, 810, 60);
    bw.endFill();
    this.addChild(bw);
  }

  this.landZones.push(g);
};

Level.prototype.getLandZones = function () {
  return this.landZones;
};

/**
 *
 * @returns {Array} all bodies in the level
 */
Level.prototype.getAllBodiesInThisLevel = function () {
  // landing zones bodies
  let lz = this.getLandZones();
  // lander body
  let l = this.getLander().body;
  // terrain body
  let t = this.terrain.body;

  // return a flatten array of all bodies in the level
  return lz.concat(l).concat(t).flat();
};

/**
 * removing Keys Events
 */
Level.prototype.removeKeyEvents = function () {
  this.keyUp.unsubscribe();
  this.keyRight.unsubscribe();
  this.keyLeft.unsubscribe();

  // TODO: synchro with state

  //   this.keyUp = null;
  //   this.keyRight = null;
  //   this.keyLeft = null;
};

/**
 * adding keys events
 */
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

  // pause / unpause
  this.keySpace.press = () => {
    // console.log("SPACE Released");
    if (me.state.isPause) {
      me.state.isPause = false;
      me.state.log("EXIT PAUSE");
    } else {
      me.state.isPause = true;
      me.state.log("ENTER PAUSE");
    }
  };

  // lander controls
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
