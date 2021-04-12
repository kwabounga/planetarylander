function Main(data) {
  this.loader = document.getElementById("loader");
  this.view = document.getElementById("game-canvas");

  this.state = State.getInstance();

  this.data = data;

  // this.Engine = Matter.Engine;
  // this.World = Matter.World;
  // this.Bodies = Matter.Bodies;
  // this.Mouse = Matter.Mouse;
  // this.Events = Matter.Events;
  // this.MouseConstraint = Matter.MouseConstraint;

  this.engine = Matter.Engine.create();
  this.bodies = [];

  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(800, 600, {
    backgroundColor: "#3a3a41".replace("#", "0x"),
    antialias: true,
    resolution: window.devicePixelRatio,
    view: this.view,
  });

  // this.lander;
  this.level;

  this.loadSpriteSheet();

  this.loopID;
}

Main.prototype.showCanvas = function () {
  this.view.style = "";
  this.loader.style = "display: none;";
};
Main.prototype.showLoader = function () {
  this.view.style = "display: none;";
  this.loader.style = "";
};
/**
 * sprite sheet loader
 */
Main.prototype.loadSpriteSheet = function () {
  this.state.log("LOAD");
  var loader = PIXI.loader;
  this.data.levels.forEach((lvl, lvlID) => {
    loader.add(`terrain${lvlID}`, this.data.levels[lvlID].sprite);
  });
  // loader.add("terrain", this.data.levels[this.state.game.currentLevel].sprite);
  loader.add("landersSpriteSheet", "./assets/landers.json");
  loader.add("uiSpriteSheet", "./assets/ui.json");
  loader.add("deadFontWalking", "./assets/DeadFontWalking.fnt");
  loader.once("complete", this.spriteSheetLoaded.bind(this));
  loader.load();
};

Main.prototype.spriteSheetLoaded = function () {
  this.state.log("LOADED");
  const me = this;

  // creation du niveau et ajout des elements dans le moteur
  this.level = new Level(this.stage, this.engine, this.data, () => {
    me.level.getAllBodiesInThisLevel().forEach((b) => {
      me.bodies.push(b);
    });
    me.initAfterLoadingTerrain();
  });
};

Main.prototype.initAfterLoadingTerrain = function () {
  this.state.log("initAfterLoadingTerrain");
  this.ui = this.createUi();

  this.engine.world.gravity.scale = this.data.environment.gravityScale;

  // add all of the bodies to the world
  Matter.World.add(this.engine.world, this.bodies);

  // loader to game swapper
  this.showCanvas();
  this.addMouseConstraint();
  // run the engine
  this.loopID = requestAnimationFrame(this.update.bind(this));
};
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

Main.prototype.update = function () {
  if (!this.state.isPause) {
    // using pixi loop for Matter Engine updating
    Matter.Engine.update(this.engine);
    this.level.update();
    this.updateViewLevel(this.level)
    if (!this.level.isGameOver) {
      this.ui.update();
    }

    // pixi render the container
    this.renderer.render(this.stage);
  }

  // re-looping
  this.loopID = requestAnimationFrame(this.update.bind(this));
};
Main.prototype.updateViewLevel = function(lvl){
  let target = lvl.getLander().body
  let newPos = (300-target.position.y); /// 300 (height of canvas /2) 
  // this.state.log(newPos);
  lvl.y = Math.min(0,Math.max(newPos,-1400)) // 2000 (size of the level) - 600 (height of canvas)

}
