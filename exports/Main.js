/**
 * Main Object
 *
 * @param {Object} data  from json's world
 */
function Main(data) {
  // get doms Elements
  this.loaderDomElmt = document.getElementById("loader");
  this.view = document.getElementById("game-canvas");
  
  // sprites loader
  this.loader = PIXI.loader
  // get data js object (from json)
  this.data = data;

  // get state (singleton)
  this.state = State.getInstance();

  // overwrite world vars in states
  this.state.game.speedMax = this.data.lander.motor.speedMax;
  this.state.game.fuelMax = this.data.lander.motor.fuel;
  this.state.game.fuel = this.data.lander.motor.fuel;

  // TODO: loading from a db some game state ??

  // Matter initialization
  this.engine = Matter.Engine.create();
  this.bodies = [];

  // PIXI Initialization
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(800, 600, {
    backgroundColor: "#00000c".replace("#", "0x"),
    antialias: true,
    // resolution: window.devicePixelRatio,
    view: this.view,
  });

  
  this.level;
  this.menu;
  this.loopID;
  // launch the assets loading
  this.loadSpriteSheet();

}

Main.prototype.showCanvas = function () {
  this.view.style = "";
  this.loaderDomElmt.style = "display: none;";
};

Main.prototype.showLoader = function () {
  this.view.style = "display: none;";
  this.loaderDomElmt.style = "";
};


/**
 * sprite sheet loader
 */
Main.prototype.loadSpriteSheet = function () {
  const me = this;
  this.state.log("LOAD");
  // var loader = PIXI.loader;
  this.data.levels.forEach((lvl, lvlID) => {
    // loader.add(`terrain${lvlID}`, this.data.levels[lvlID].sprite);
    me.loader.add(`terrain${lvlID}`, lvl.sprite);
  });
  // loader.add("terrain", this.data.levels[this.state.game.currentLevel].sprite);
  this.loader.add("landersSpriteSheet", "./assets/landers.json");
  this.loader.add("uiSpriteSheet", "./assets/ui.json");
  this.loader.add("deadFontWalking", "./assets/DeadFontWalking.fnt");
  this.loader.once("complete", this.spriteSheetLoaded.bind(this));
  this.loader.load();
};

Main.prototype.spriteSheetLoaded = function () {
  this.state.log("LOADED");
  const me = this;
  // console.log(me.loader);

  // Tools.overwritePixiTexture('terrain0', "./assets/levels/png/level_02.png", ()=>{
  //   console.log(me.loader);
  // })
  // console.log(this.loader);
  // delete PIXI.loader.resources['terrain0']; /// its work!
  // console.log(this.loader);
  
  // this.data.levels.forEach((lvl, lvlID) => {
  //   // loader.add(`terrain${lvlID}`, this.data.levels[lvlID].sprite);
  //   me.loader.add(`terrain${lvlID}`, lvl.sprite);
  // });
  // this.loader.once("complete", ()=>{
    
  // });
  // this.loader.load();

  // FOR DEBUG ONLY
  // TODO: Access to the Menu then loading levels etc.


  // creation du niveau et ajout des elements dans le moteur
  
  this.addMenu()

};

Main.prototype.initLevel = function (context) {
  const me = this;
  this.removeMenu();
  this.state.game.currentLevel = context.id;
  this.level = new Level(this.stage, this.engine, this.data, () => {
    me.level.getAllBodiesInThisLevel().forEach((b) => {
      me.bodies.push(b);
    });
    me.initAfterLoadingTerrain();
  });
}
Main.prototype.addMenu = function () {
  this.menu = new Menu(this.stage, this.engine)
 this.menu.emitter.on('start',this.initLevel.bind(this))
  
  this.showCanvas();
  this.addMouseConstraint();
  console.log('BODIES',this.menu.bodies)
  this.loopID = requestAnimationFrame(this.updateMenu.bind(this));
}

Main.prototype.removeMenu = function () {
  cancelAnimationFrame(this.loopID);
  this.stage.removeChild(this.menu)
  this.menu = null;
  Matter.World.clear(this.engine.world)
}

Main.prototype.initAfterLoadingTerrain = function () {
  this.state.log("initAfterLoadingTerrain");
  this.ui = this.createUi();

  this.engine.world.gravity.scale = this.data.environment.gravityScale;

  // add all of the bodies to the world
  Matter.World.add(this.engine.world, this.bodies);

  // loader to game swapper
  this.showCanvas();
  this.addMouseConstraint();

  // this.applyRules();
  // run the engine
  this.loopID = requestAnimationFrame(this.update.bind(this));
};



/**
 * 
 * @returns {PIXI.Container} the game infos  on screen HUD (Heads-Up Display) or ATH (Affichage Tête Haute)
 */
Main.prototype.createUi = function () {
  let ui = new Ui(this.data);
  this.stage.addChild(ui);
  return ui;
};



// only for test
Main.prototype.addMouseConstraint = function () {
  // add mouse control
  var mouse = Matter.Mouse.create(this.renderer.view),
    mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        angularStiffness: 0,
        render: {
          visible: false,
        },
      },
    });
  Matter.World.add(this.engine.world, mouseConstraint);
  this.renderer.mouse = mouse;
};

Main.prototype.updateMenu = function () {
  this.menu.update()
  Matter.Engine.update(this.engine);
  this.renderer.render(this.stage);
  this.loopID = requestAnimationFrame(this.updateMenu.bind(this));
}
Main.prototype.update = function () {
  if (!this.state.isPause) {
    // using pixi loop for Matter Engine updating
    this.level.update();
    Matter.Engine.update(this.engine);
    this.updateViewLevel(this.level);
    if (!this.level.isGameOver) {
      this.ui.update();
    }

    // pixi render the container
    this.renderer.render(this.stage);
  }

  // re-looping
  this.loopID = requestAnimationFrame(this.update.bind(this));
};
Main.prototype.updateViewLevel = function (lvl) {
  let target = lvl.getLander().body;
  let newPos = 300 - target.position.y; /// 300 (height of canvas /2)
  // this.state.log(newPos);
  lvl.y = Math.min(0, Math.max(newPos, -1400)); // 2000 (size of the level) - 600 (height of canvas)
};


Main.prototype.loadWorldData = function(worldId) {
  const me = this;
  //let wID = this.state.game.currentWorld;
  let wName = this.menuData.worlds[worldId]
  Tools.ajaxGet(`./data/${wName}.json`, (data) => {
    let d = JSON.parse(data);
    me.data = d;

  });
}