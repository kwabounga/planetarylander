/**
 *
 * @param {PIXI.Container} stage the stage
 * @param {Matter.Engine} engine the physic engine
 * @param {Object} data from json
 * @param {Function} callBack [optional]
 */
function Level(main, callBack = null) {
  PIXI.Container.call(this);
  this.ui = main.ui;
  this.engine = main.engine;
  this.stage = main.stage;
  this.data = main.data;
  this.isGameOver = false;
  this.state = State.getInstance();

  this.lander = null;
  this.terrain = null;
  this.landZones = [];
  this.stars = [];
  this.bonus = [];
  this.malus = [];
  this.callBack = callBack;

  this.landerExploded = null;

  this.stage.addChild(this);

  this.tweenRule = null;

  // TODO: gerer les landzones ds les json

  // overwrite settings
  this.overWriteSettings(this.data.levels[this.state.game.currentLevel])
  this.loadTerrain(this.data.levels[this.state.game.currentLevel]);
}
/**
 * Proto
 */
Level.prototype = Object.create(PIXI.Container.prototype);

/**
 * Set the params of the current level
 * @param {object} levelParams 
 */
Level.prototype.overWriteSettings = function (levelParams) {
  // condition sur le fuel
  if (levelParams.fuelMax) {
    this.state.game.fuelMax = levelParams.fuelMax;
    this.state.game.fuel = levelParams.fuelMax;
  }
  // si lander déjà endommagé
  if (levelParams.shell) {
    this.state.game.shell = levelParams.shell;
  }
}
/**
 * load the current terrain (svg) then init and launch callback if any
 * @param {Object} levelParams from json levels
 */
Level.prototype.loadTerrain = function (levelParams) {
  const me = this;
    Terrains.load(levelParams,me.state.game.currentLevel, (terrain) => {
    me.terrain = terrain;
    this.addChild(me.terrain.sprite);

  // displaying wireframe on debug
  if (me.state.isDebug) {
    this.addChild(me.terrain.wireFrame);
  }
    if (me.callBack) {
          me.init();
          me.callBack();
        }
  })
};

/**
 * initialization
 */
Level.prototype.init = function () {
  const me = this;

  // bodies and assets
  this.state.log("terrain", me.terrain.body);
  this.addLander();
  
  this.addlandZones();
  this.addStars();
  this.addBonus();

  // collisions
  this.addCollisions();
  this.applyRules()
};


// TODO : extract check methods and check if the collided second object is the lander
/**
 * hitTest for landing zones / stars  ..see for  / bonus / malus here ?
 */
Level.prototype.addCollisions = function () {
  const me = this;
  Matter.Events.on(me.engine, "collisionActive", function (event) {
    if (me.lander.isDie) return;
    var pairs = event.pairs;
    me.state.log("collisionActive", pairs[0]);
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];
      // terrain
      if (me.terrain.body.parts.includes(pair.bodyA)) {
        me.damageLander();
      } else if (me.terrain.body.parts.includes(pair.bodyB)) {
        me.damageLander();
      }
    }
  });
  Matter.Events.on(me.engine, "collisionStart", function (event) {
    
    var pairs = event.pairs;
    me.state.log("collisionStart", pairs[0]);
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];

      // landing
      me.landZones.forEach((lZone) => {
        if (pair.bodyA === lZone && pair.bodyB === me.lander.body) {
          me.end();
        } else if (pair.bodyB === lZone && pair.bodyA === me.lander.body) {
          me.end();
        }
      });

      if (me.lander.isDie) return;
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
/**
 * #die
 */
Level.prototype.die = function () {
  const me = this;
  this.lander.isDie = true;
  console.log(this.lander.sprite.params.sprite);  

  Landers.explode(me.lander, me, (lExp)=>{
    me.landerExploded = lExp;
    // TODO : change the collider id for lander and terrain see for have multiples collider ID for terrain
    me.lander.sprite.visible = false;
    me.lander.body.isSensor = true;
  })
};
/**
 * #damageLander
 * add some damages to  the lander
 */
Level.prototype.damageLander = function () {
  const me = this;
  this.state.log("DAMAGE");
  let damage = Math.abs((this.state.game.speedX + this.state.game.speedY) / 2 );
  this.state.game.shell -= damage;//0.1;
  if (this.state.game.shell <= 0) {
    this.state.game.shell = 0;
    if (this.lander.isDie) return;
    this.die();
  }
};
/**
 * getBonus
 */
Level.prototype.getBonus = function (bonus) {
  if (this.lander.isDie) return;
  this.state.log("getBonus !!! ", bonus);
  if (!bonus.isCatched) {
    gsap.to(bonus.body.position, {
      y: -this.y,
      x: -100,
      duration: 0.75,
      ease: "elastic.in(1, 0.75)",
    });
    bonus.isCatched = true;
    this.state.game[bonus.type] += bonus.amount;
  }
};
/**
 * getStar
 */
Level.prototype.getStar = function (star) {
  if (this.lander.isDie) return;
  this.state.log("getStar !!! ", star);
  if (!star.isCatched) {
    gsap.to(star.body.position, {
      y: -this.y,
      x: -100,
      duration: 0.75,
      ease: "elastic.in(1, 0.75)",
    });
    star.isCatched = true;
  }
};
/**
 * game over
 */
Level.prototype.gameOver = function () {
  console.log("GAME OVER");
  this.removeKeyEvents();
  this.isGameOver = true;
  this.state.isPause = true;
  // see here to cancelAnimationFrame on game over 
}
/**
 * win
 */
Level.prototype.win = function () {
  if (this.lander.isDie) return;
  // TODO: make condition for win or loose before call win
  this.removeKeyEvents();
  this.lander.sprite.showFlag();
  this.lander.sprite.hideReactor();
  this.lander.sprite.hideStabilizersLeft();
  this.lander.sprite.hideStabilizersRight();
  this.isGameOver = true;
  console.log("WIN");
};


Level.prototype.end = function () {
  // const me = this;
  if (this.lander.isDie){
    //this.gameOver() // dans l'update
  }else {
    if (Math.abs(this.state.game.speedY * 25) > this.state.game.speedMax || Math.abs(this.state.game.speedX * 25) > this.state.game.speedMax){
      this.state.game.shell = 0;
      this.damageLander()
    }else {
      this.win();
    }
  };
}
/**
 * #gravityRule
 * #dustDevils
 */
Level.prototype.applyRules = function () {
  console.log(this.engine.world.gravity)
  if(this.data.levels[this.state.game.currentLevel].rules){
    let params = this.data.levels[this.state.game.currentLevel].rules.params;
    switch (this.data.levels[this.state.game.currentLevel].rules.type) {
      case "gravity_change":
        // #gravityRule
        console.log('GRAVITY_CHANGE');
        
        this.tweenRule = new GravityChange(this.engine, params);
        break;
        case "dust_devils":
          // #gravityRule
          console.log('DUST DEVILS');
          let dd = new DustDevils(params);
          this.addChild(dd.sprite);
          dd.sprite.x=400;
          dd.sprite.y=300;
          // let params = this.data.levels[this.state.game.currentLevel].rules.params;
          // this.tweenRule = gsap.fromTo(this.engine.world.gravity, params.from,params.to);
          break;

      default:
        break;
    }
  }
}
/**
 * update / game loop
 */
Level.prototype.update = function () {
  this.updateLander();
  this.updateStars();
  this.updateBonus();
  if (this.landerExploded && this.landerExploded.bodies.length > 0) {
    this.updateStack();
  }
  // if(this.lander.isDie){
  //   this.forceUpdateUI()
  // }
};
// Level.prototype.forceUpdateUI = function () {
  
// }
Level.prototype.updateStack = function () {
  const me = this;
  this.landerExploded.bodies.forEach((b, i) => {
    me.landerExploded.sprites[i].rotation = b.angle;
    me.landerExploded.sprites[i].position = b.position;
  });
};
Level.prototype.updateLander = function () {
  const m = this;
  if (m.lander.isDie && m.lander.body.position.y >= m.terrain.sprite.height + 600){
    console.log(m.lander.body)
    m.gameOver();
  }
  if (
    this.state.keyUp &&
    this.state.keyRight &&
    this.state.keyLeft &&
    this.state.game.fuel > 0
  ) {
    if (this.state.keyUp.isDown) {
      this.state.game.power += m.data.lander.motor.reactorPower;
      this.state.game.power = Math.min(this.state.game.power, m.data.lander.motor.reactorPowerMax)
      let landerRot = (m.lander.body.angle * 180) / Math.PI;
      let velY =
        -this.state.game.power *
        Math.cos((landerRot * Math.PI) / 180);
      let velX =
        -this.state.game.power *
        Math.sin((landerRot * Math.PI) / 180) *
        -1;
      m.state.log(landerRot, velY, velX);

      Matter.Body.applyForce(
        m.lander.body,
        { x: m.lander.body.position.x, y: m.lander.body.position.y },
        { x: velX / 200, y: velY / 200 }
      );
      this.state.game.fuel -= m.data.lander.motor.fuelConsumption;
    } else {
      this.state.game.power  = 0
    }
    if (this.state.keyRight.isDown) {
      Matter.Body.setAngularVelocity(
        m.lander.body,
        m.lander.body.angularVelocity + m.data.lander.motor.stabilizersPower
      );
      this.state.game.fuel -= m.data.lander.motor.fuelConsumption / 10;
    }
    if (this.state.keyLeft.isDown) {
      Matter.Body.setAngularVelocity(
        m.lander.body,
        m.lander.body.angularVelocity - m.data.lander.motor.stabilizersPower
      );
      this.state.game.fuel -= m.data.lander.motor.fuelConsumption / 10;
    }
  } else {
    this.state.game.fuel = 0;
    this.lander.sprite.hideStabilizersLeft();
    this.lander.sprite.hideStabilizersRight();
    this.lander.sprite.hideReactor();
  }
  this.state.game.orientation =
    ((this.lander.body.angle * 180) / Math.PI) % 360;
  this.state.game.speedX = this.lander.body.velocity.x;
  this.state.game.speedY = this.lander.body.velocity.y;

  this.lander.sprite.position = this.lander.body.position;
  this.lander.sprite.rotation = this.lander.body.angle;
  if (this.state.isDebug) {
    this.lander.wireFrame.position = this.lander.body.position;
    this.lander.wireFrame.rotation = this.lander.body.angle;
  }
  this.lander.sprite.update();
};

/**
 * create, set and add the lander
 */
Level.prototype.addLander = function () {
  this.state.log("ADD LANDER");
  const me = this;
  this.lander = Landers.create(me.data.lander, this);
  this.state.log(this.lander.sprite);

  // adding wireframe to renderer if debug
  if (me.state.isDebug) {
    this.addChild(this.lander.wireFrame);
  }
};

Level.prototype.getLander = function () {
  return this.lander;
};

Level.prototype.updateBonus = function () {
  const me = this;
  if (this.data.levels[this.state.game.currentLevel].bonus) {
    this.bonus.forEach((b) => {
      b.sprite.position = b.body.position;
      if (me.state.isDebug) {
        b.wireFrame.position = b.body.position;
      }
    });
  }
};
Level.prototype.updateStars = function () {
  const me = this;
  this.stars.forEach((star) => {
    star.sprite.position = star.body.position;
    if (me.state.isDebug) {
      star.wireFrame.position = star.body.position;
    }
  });
};
Level.prototype.addBonus = function () {
  if (!this.data.levels[this.state.game.currentLevel].bonus) {
    return;
  }
  const me = this;
  let aBonus = this.data.levels[this.state.game.currentLevel].bonus;
  let bonusSize = 58;
  aBonus.forEach((bonusInfos) => {
    // body
    let b = Matter.Bodies.circle(bonusInfos.x, bonusInfos.y, bonusSize / 2, {
      isStatic: true,
      isSensor: true,
    });
    // wireFrame
    let bw = new PIXI.Graphics();
    // Circle
    bw.lineStyle(2, 0xfeeb77, 1);
    bw.drawCircle(0, 0, bonusSize / 2);
    bw.endFill();
    bw.position.x = bonusInfos.x;
    bw.position.y = bonusInfos.y;
    if (me.state.isDebug) {
      me.addChild(bw);
    }
    // sprite
    let bsp = new BonusSprite(bonusInfos.type, bonusInfos.amount); //new PIXI.Sprite(PIXI.Texture.from(`bonus_${bonusInfos.type}0000`))

    bsp.x = bonusInfos.x;
    bsp.y = bonusInfos.y;
    this.addChild(bsp);
    let bonus = {
      body: b,
      sprite: bsp,
      wireFrame: bw,
      type: bonusInfos.type,
      amount: bonusInfos.amount,
    };
    me.bonus.push(bonus);
  });
};
Level.prototype.addStars = function () {
  let aStars = this.data.levels[this.state.game.currentLevel].stars;
  this.state.log(aStars);
  let starSize = 58;
  const me = this;
  aStars.forEach((starInfos) => {
    // body
    let s = Matter.Bodies.circle(starInfos.x, starInfos.y, starSize / 2, {
      isStatic: true,
      isSensor: true,
    });
    // wireFrame
    let sw = new PIXI.Graphics();
    // Circle
    sw.lineStyle(2, 0xfeeb77, 1);
    sw.drawCircle(0, 0, starSize / 2);
    sw.endFill();
    sw.position.x = starInfos.x;
    sw.position.y = starInfos.y;
    if (me.state.isDebug) {
      me.addChild(sw);
    }
    // sprite
    let sp = new PIXI.Sprite(PIXI.Texture.from("ingame_star0000"));
    sp.anchor.set(0.5);
    sp.x = starInfos.x;
    sp.y = starInfos.y;
    this.addChild(sp);
    let star = { body: s, sprite: sp, wireFrame: sw };
    me.stars.push(star);
  });
};

Level.prototype.addlandZones = function () {
  const me = this;
  let lZonesFromJson = this.data.levels[this.state.game.currentLevel].landZones;
  lZonesFromJson.forEach((lZone) => {
    //todo loop with lands zones object
    let g = Matter.Bodies.rectangle(
      lZone.width / 2 + lZone.x,
      lZone.height / 2 + lZone.y,
      lZone.width,
      lZone.height,
      { isStatic: true }
    );
    if (me.state.isDebug) {
      let bw = new PIXI.Graphics();
      // Rectangle
      bw.lineStyle(2, 0xfeeb77, 1);
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
    this.stars.map((s) => s.body),
    this.bonus.map((b) => b.body),
  ];

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
      me.state.log("EXIT PAUSE");
      me.ui.updateTextField(
        me.ui.screenInfos,
        '',
        Tools.pixiColor("#ffc0c0"),
        true
        );
        me.state.isPause = false;
    } else {
      me.state.log("ENTER PAUSE");
      me.ui.updateTextField(
        me.ui.screenInfos,
        'Pause',
        Tools.pixiColor("#ffc0c0"),
        true
        );
        setTimeout(()=>{me.state.isPause = true;},20)
        
    }
  };

  // lander controls
  this.keyLeft.press = () => {
    me.state.log("keyLeft pressed");
    if (this.state.game.fuel == 0) return;
    me.lander.sprite.showStabilizersLeft();
  };
  this.keyLeft.release = () => {
    me.state.log("keyLeft Released");
    if (this.state.game.fuel == 0) return;
    me.lander.sprite.hideStabilizersLeft();
  };
  this.keyRight.press = () => {
    me.state.log("keyRight pressed");
    if (this.state.game.fuel == 0) return;
    me.lander.sprite.showStabilizersRight();
  };
  this.keyRight.release = () => {
    me.state.log("keyRight Released");
    if (this.state.game.fuel == 0) return;
    me.lander.sprite.hideStabilizersRight();
  };

  this.keyUp.press = () => {
    me.state.log("Up pressed");
    if (this.state.game.fuel == 0) return;
    me.lander.sprite.showReactor();
  };
  this.keyUp.release = () => {
    me.state.log("Up Released");
    if (this.state.game.fuel == 0) return;
    me.lander.sprite.hideReactor();
  };
};
