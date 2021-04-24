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
    backgroundColor: Tools.pixiColor("#00000c"),
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

/**
 * Display the canvas ; hide the loader
 */
Main.prototype.showCanvas = function () {
  this.view.style = "";
  this.loaderDomElmt.style = "display: none;";
};

/**
 * Display the loader ; hide the canvas
 */
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
  
  // TODO: load only the current terrain 
  this.data.levels.forEach((lvl, lvlID) => {
    // loader.add(`terrain${lvlID}`, this.data.levels[lvlID].sprite);
    me.loader.add(`terrain${lvlID}`, lvl.sprite);
  });
  
  this.loader.add("landersSpriteSheet", "./assets/landers.json");
  this.loader.add("uiSpriteSheet", "./assets/ui.json");
  this.loader.add("deadFontWalking", "./assets/DeadFontWalking.fnt");
  this.loader.once("complete", this.spriteSheetLoaded.bind(this));
  this.loader.load();
};

/**
 * callback after loading sprite sheet
 */
Main.prototype.spriteSheetLoaded = function () {
  this.state.log("LOADED");
  const me = this;
  

  // FOR DEBUG ONLY
  // HERE the overwriting texture system for load next terrain
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

  
    
  // Access to the Menu
  this.addMenu()

};
/**
 * level initialization
 * @param {object} context the level context
 */
Main.prototype.initLevel = function (context) {
  const me = this;
  this.removeMenu();
  this.ui = this.createUi();
  this.state.game.currentLevel = context.id;

  this.level = new Level(this, () => {
    me.level.getAllBodiesInThisLevel().forEach((b) => {
      me.bodies.push(b);
    });
    me.initAfterLoadingTerrain();
  });

  this.stage.addChild( this.ui);
}

/**
 * add and show the Menu
 */
Main.prototype.addMenu = function () {
  this.menu = new Menu(this.stage, this.engine)
  this.menu.emitter.on('start',this.initLevel.bind(this))
  
  this.showCanvas();
  this.addMouseConstraint();
  console.log('BODIES',this.menu.bodies)
  this.loopID = requestAnimationFrame(this.updateMenu.bind(this));
}

/**
 * remove and hide the Menu
 */
Main.prototype.removeMenu = function () {
  cancelAnimationFrame(this.loopID);
  this.stage.removeChild(this.menu)
  this.menu = null;
  Matter.World.clear(this.engine.world)
}

/**
 * callBack after loading the terrain
 * terrain initialization
 */
Main.prototype.initAfterLoadingTerrain = function () {
  this.state.log("initAfterLoadingTerrain");  

  this.engine.world.gravity.scale = this.data.environment.gravityScale;

  // add all of the bodies to the world
  Matter.World.add(this.engine.world, this.bodies);

  // loader to game swapper
  this.showCanvas();
  this.addMouseConstraint();

  // launch the  start sequency
  // then run the engine
  this.startSequency(()=>{
    this.level.addKeysEvents();
    this.loopID = requestAnimationFrame(this.update.bind(this));
  })
};

/**
 * 
 * @param {function} callBack callback after starting sequency
 */
Main.prototype.startSequency = function(callBack){
  const me = this;
  let seqInfos = [
    {text:'Get ready', time:3, color:"#c7ff8f"},
    {text:'3', time:1, color:"#ff8f8f"},
    {text:'2', time:1, color:"#ffd88f"},
    {text:'1', time:1, color:"#c7ff8f"},
    {text:'let\'s Go', time:1, color:"#ffffff"}
    
  ];
  let delay = 0;
  seqInfos.forEach((sInfos)=>{
      setTimeout(() => {
        me.ui.updateTextField(
          me.ui.screenInfos,
          sInfos.text,
          Tools.pixiColor(sInfos.color),
          true
        );
        console.log(sInfos.text)
        me.renderer.render(me.stage);
      }, delay * 1000);
      delay += sInfos.time;    
  })
  setTimeout(() => {
    me.ui.updateTextField(
      me.ui.screenInfos,
      '',
      Tools.pixiColor("#7fff00")
    );
    callBack();
  }, (delay + 1) * 1000);
}

/**
 * 
 * @returns {PIXI.Container} the game infos  on screen HUD (Heads-Up Display) or ATH (Affichage Tête Haute)
 */
Main.prototype.createUi = function () {
  let ui = new Ui(this.data);  
  return ui;
};



/**
 * Debug only 
 * Mouse constraint 
 */
Main.prototype.addMouseConstraint = function () {
  // add mouse controls
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

/**
 * loop for updating menu display
 */
Main.prototype.updateMenu = function () {
  this.menu.update()
  Matter.Engine.update(this.engine);
  this.renderer.render(this.stage);
  this.loopID = requestAnimationFrame(this.updateMenu.bind(this));
}

/**
 * main loop 
 */
Main.prototype.update = function () {
  
  if (!this.state.isPause) {
    // using pixi loop for Matter Engine updating
    Matter.Engine.update(this.engine);
    this.level.update();
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

/**
 * Updates the view of the level relative to the position of the lander
 * @param {Level} lvl the current level
 */
Main.prototype.updateViewLevel = function (lvl) {
  let target = lvl.getLander().body;
  let newPos = 300 - target.position.y; /// 300 (height of canvas /2)
  lvl.y = Math.min(0, Math.max(newPos, -1400)); // 2000 (size of the level) - 600 (height of canvas)
};

/**
 * load the json world data
 * @param {int} worldId the world id
 */
Main.prototype.loadWorldData = function(worldId) {
  const me = this;
  let wName = this.menuData.worlds[worldId]
  Tools.ajaxGet(`./data/${wName}.json`, (data) => {
    let d = JSON.parse(data);
    me.data = d;

  });
}