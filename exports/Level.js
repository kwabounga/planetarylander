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
  if(this.data.levels[this.state.game.currentLevel].fuelMax){
    this.state.game.fuelMax = this.data.levels[this.state.game.currentLevel].fuelMax;
    this.state.game.fuel = this.data.levels[this.state.game.currentLevel].fuelMax;
  }
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
  const me = this;
  this.state.log('terrain', me.terrain.body);
  this.addLander();
  // todo: gerer les landzones ds les json
  this.addlandZones();
  this.addStars();
  this.addBonus();

  // controls
  this.addKeysEvents();

  // collisions
  this.addCollisions();
};

/**
 * hitTest for landing zones / stars  ..see for  / bonus / malus here ?
 */
Level.prototype.addCollisions = function () {
  const me = this;
  Matter.Events.on(me.engine, "collisionActive", function (event) {
    var pairs = event.pairs;
    me.state.log("collisionActive",pairs[0]);
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];
      // terrain
      if (me.terrain.body.parts.includes(pair.bodyA)) {
        me.damageLander();
      } else if (me.terrain.body.parts.includes(pair.bodyB)) {
        me.damageLander();
      }
    }
  })
  Matter.Events.on(me.engine, "collisionStart", function (event) {
    var pairs = event.pairs;
    me.state.log("collisionStart",pairs[0]);
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];

      // landing
      me.landZones.forEach((lZone) => {
        if (pair.bodyA === lZone) {
          me.win();
        } else if (pair.bodyB === lZone) {
          me.win();
        }
      });

      // stars
      me.stars.forEach((star) => {
        if (pair.bodyA === star.body) {
          me.getStar(star);
        } else if (pair.bodyB === star.body) {
          me.getStar(star);
        }
      });

      // bonus
      me.bonus.forEach((b) => {
        if (pair.bodyA === b.body) {
          me.getBonus(b);
        } else if (pair.bodyB === b.body) {
          me.getBonus(b);
        }
      });
    }
  });
};
Level.prototype.damageLander = function () {
  this.state.log('DAMAGE')
  this.state.game.shell -= 0.1;
}
/**
 * getBonus
 */
Level.prototype.getBonus = function (bonus) {
 this.state.log('getBonus !!! ', bonus)
 if(!bonus.isCatched){
   gsap.to(bonus.body.position, {
     y: -this.y,
     x: -100,
     duration: 0.75,
     ease: "elastic.in(1, 0.75)",
   });
   bonus.isCatched = true;
   this.state.game[bonus.type] += bonus.amount;
 }

}
/**
 * getStar
 */
Level.prototype.getStar = function (star) {
 this.state.log('getStar !!! ', star)
 if(!star.isCatched){
   gsap.to(star.body.position, {
     y: -this.y,
     x: -100,
     duration: 0.75,
     ease: "elastic.in(1, 0.75)",
   });
   star.isCatched = true;
 }

}
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
  
  this.updateLander();
  this.updateStars();
  this.updateBonus();
};
Level.prototype.updateLander = function(){
  const m = this;

  if (this.state.keyUp && this.state.keyRight && this.state.keyLeft && (this.state.game.fuel > 0)) {
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
      this.state.game.fuel -= m.data.lander.motor.fuelConsumption;
    }
    if (this.state.keyRight.isDown) {
      Matter.Body.setAngularVelocity(
        m.lander.body,
        m.lander.body.angularVelocity + m.data.lander.motor.stabilizersPower
      );
      this.state.game.fuel -= (m.data.lander.motor.fuelConsumption/10)
    }
    if (this.state.keyLeft.isDown) {
      Matter.Body.setAngularVelocity(
        m.lander.body,
        m.lander.body.angularVelocity - m.data.lander.motor.stabilizersPower
        );
        this.state.game.fuel -= (m.data.lander.motor.fuelConsumption/10)
    }
  } else {
    this.state.game.fuel = 0;
    this.lander.sprite.hideStabilizersLeft();
    this.lander.sprite.hideStabilizersRight();
    this.lander.sprite.hideReactor();
  }
  this.state.game.orientation = ((this.lander.body.angle * 180)/ Math.PI) % 360 ;
  this.state.game.speedX = this.lander.body.velocity.x;
  this.state.game.speedY = this.lander.body.velocity.y;

  this.lander.sprite.position = this.lander.body.position;
  this.lander.sprite.rotation = this.lander.body.angle;
  if (this.state.isDebug) {
    this.lander.wireFrame.position = this.lander.body.position;
    this.lander.wireFrame.rotation = this.lander.body.angle;
  }
  this.lander.sprite.update();
}
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

Level.prototype.updateBonus= function () {
  const me = this;
  if(this.data.levels[this.state.game.currentLevel].bonus){
    this.bonus.forEach((b)=>{
      b.sprite.position = b.body.position;    
      if (me.state.isDebug) {
        b.wireFrame.position = b.body.position;
      }
    })
  }
  
}
Level.prototype.updateStars = function () {
  const me = this;
  this.stars.forEach((star)=>{
    star.sprite.position = star.body.position;    
    if (me.state.isDebug) {
      star.wireFrame.position = star.body.position;
    }
  })
}
Level.prototype.addBonus = function () {
  if(!this.data.levels[this.state.game.currentLevel].bonus){
    return;
  }
  const me = this;
  let aBonus = this.data.levels[this.state.game.currentLevel].bonus;
  let bonusSize = 58;
  aBonus.forEach((bonusInfos) => {
    // body
    let b = Matter.Bodies.circle((bonusInfos.x),(bonusInfos.y),(bonusSize/2),{isStatic:true, isSensor:true})
    // wireFrame
    let bw = new PIXI.Graphics();
      // Circle
      bw.lineStyle(2, 0xFEEB77, 1);
      bw.drawCircle(0, 0, (bonusSize/2));
      bw.endFill();
      bw.position.x = bonusInfos.x;
      bw.position.y = bonusInfos.y; 
    if (me.state.isDebug) {
      me.addChild(bw);
    }
    // sprite
    let bsp = new BonusSprite(bonusInfos.type, bonusInfos.amount)//new PIXI.Sprite(PIXI.Texture.from(`bonus_${bonusInfos.type}0000`))
    
    bsp.x = bonusInfos.x
    bsp.y = bonusInfos.y
    this.addChild(bsp)
    let bonus = {body:b,sprite:bsp,wireFrame:bw, type:bonusInfos.type, amount:bonusInfos.amount}
    me.bonus.push(bonus);
  });
}
Level.prototype.addStars = function () {
  let aStars = this.data.levels[this.state.game.currentLevel].stars;
  this.state.log(aStars)
  let starSize = 58;
  const me = this;
  aStars.forEach((starInfos) => {
    // body
    let s = Matter.Bodies.circle((starInfos.x),(starInfos.y),(starSize/2),{isStatic:true, isSensor:true})
    // wireFrame
    let sw = new PIXI.Graphics();
      // Circle
      sw.lineStyle(2, 0xFEEB77, 1);
      sw.drawCircle(0, 0, (starSize/2));
      sw.endFill();
      sw.position.x = starInfos.x;
      sw.position.y = starInfos.y; 
    if (me.state.isDebug) {
      me.addChild(sw);
    }
    // sprite
    let sp = new PIXI.Sprite(PIXI.Texture.from('ingame_star0000'))
    sp.anchor.set(0.5);
    sp.x = starInfos.x
    sp.y = starInfos.y
    this.addChild(sp)
    let star = {body:s,sprite:sp,wireFrame:sw}
    me.stars.push(star);
  });
}


Level.prototype.addlandZones = function () {
  const me = this;
  let lZonesFromJson = this.data.levels[this.state.game.currentLevel].landZones;
  lZonesFromJson.forEach(lZone => {
      //todo loop with lands zones object
    let g = Matter.Bodies.rectangle(((lZone.width/2)+lZone.x), ((lZone.height/2)+lZone.y), lZone.width, lZone.height, { isStatic: true });
    if (me.state.isDebug) {
      let bw = new PIXI.Graphics();
      // Rectangle
      bw.lineStyle(2, 0xFEEB77, 1);
      bw.drawRect(lZone.x, lZone.y, lZone.width, lZone.height);
      bw.endFill();
      me.addChild(bw);
    }

  me.landZones.push(g);
  });
  
};

Level.prototype.getLandZones = function () {
  return this.landZones;
};

/**
 *
 * @returns {Array} all bodies in the level
 */
Level.prototype.getAllBodiesInThisLevel = function () {
  
  let bodies = [
    this.getLandZones(),
    this.getLander().body,
    this.terrain.body,
    this.stars.map((s)=>s.body),
    this.bonus.map((b)=>b.body),
  ]

  // return a flatten array of all bodies in the level
  return bodies.flat();
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
    if(this.state.game.fuel == 0) return;
    me.lander.sprite.showStabilizersLeft();
  };
  this.keyLeft.release = () => {
    me.state.log("keyLeft Released");
    if(this.state.game.fuel == 0) return;
    me.lander.sprite.hideStabilizersLeft();
  };
  this.keyRight.press = () => {
    me.state.log("keyRight pressed");
    if(this.state.game.fuel == 0) return;
    me.lander.sprite.showStabilizersRight();
  };
  this.keyRight.release = () => {
    me.state.log("keyRight Released");
    if(this.state.game.fuel == 0) return;
    me.lander.sprite.hideStabilizersRight();
  };

  this.keyUp.press = () => {
    me.state.log("Up pressed");
    if(this.state.game.fuel == 0) return;
    me.lander.sprite.showReactor();
  };
  this.keyUp.release = () => {
    me.state.log("Up Released");
    if(this.state.game.fuel == 0) return;
    me.lander.sprite.hideReactor();
  };
};
