
  /**
   * PLANETARY LANDER
   * 
   * @author Jean-Yves Chaillou @ kwa 
   * @description game like Atari's LunarLander in arcade mode 
   * @version 1.0.0 
   * @see https://github.com/kwabounga/maxi#readme 
   * @last_update Sun, 16 May 2021 17:42:35 GMT
   * ISC 
   * 
   */
  
  
/* [State.js] ... begin */
/** pattern Singleton */
const State = (function () {
    var instance;
    /**
     * createInstance
     * @returns {object} public methods of the instance
     */
    function createInstance() {
        // definition
        this.width = 800;
        this.height = 600;
        this.isMobile = Tools.isMobile();
        this.isPause = false;
        this.isDebug = false;

        this.keyUp = null;
        this.keyLeft = null;
        this.keyRight = null;
        this.keySpace = null;
        this.menuData = undefined;
        this.user = {
            token:null,
            login:'anon',
            progress:{}
        }
        this.game = {
            currentWorld:0, 
            currentLevel:0, 
            speedX:0,
            speedY:0,
            orientation:0,
            fuelMax:500,
            fuel:500,
            shell:100,
            power:0
        }
        this.log = function(...arg){
            if(instance.isDebug){
                console.log(...arg)
            }
        }
        // public elements
        return {
            width: this.width,
            height: this.height,
            isMobile: this.isMobile,            
            isPause: this.isPause,            
            isDebug: this.isDebug,            
            keyUp: this.keyUp,            
            keyLeft: this.keyLeft,            
            keyRight: this.keyRight,            
            keySpace: this.keySpace,            
            game: this.game,            
            user: this.user,            
            menuData: this.menuData,            
            log: this.log,            
        };
    }
    
    return {
        /**
         * 
         * @returns the instance of the State object
         */
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
/* ... end [State.js] */

/* added by combiner */

/* [tools.js] ... begin */
var Tools = Tools || {};

/**
 * return the real size of the current browser window
 */
Tools.availableSize = {
  width: (_) =>
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  height: (_) =>
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
};
/**
 * randomBetween
 * @param {integer} max
 * @param {integer} min
 * @returns a integer between min and max
 */
Tools.randomBetween = function (min = -40, max = 40) {
  return Math.random() * (max - min) + min;
};
/**
 * random boolean
 * @param {integer} max
 * @returns boolean
 */
Tools.rb = function (max = 15) {
  return !(Math.floor(Math.random() * max) > max / 3);
};
Tools.ajaxPost = function (url, data, callback, isJson = true) {
    var req = new XMLHttpRequest()
    req.open('POST', url)
    req.addEventListener('load', function () {
      if (req.status >= 200 && req.status < 400) {
        // Appelle la fonction callback en lui passant la réponse de la requête
        callback(req.responseText)
      } else {
        console.error(req.status + ' ' + req.statusText + ' ' + url)
      }
    })
    req.addEventListener('error', function () {
      console.error('Erreur réseau avec l\'URL ' + url)
    })
    if (isJson) {
      // Définit le contenu de la requête comme étant du JSON
      req.setRequestHeader('Content-Type', 'application/json')
      // Transforme la donnée du format JSON vers le format texte avant l'envoi
      data = JSON.stringify(data)
    }
    req.send(data)
  }
  
/**
 * ajaxGet
 * @param {string} url
 * @param {function} callback
 */
Tools.ajaxGet = function (url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      // console.log(url + ' ...loaded');
      // Appelle la fonction callback en lui passant la réponse de la requête
      callback(req.responseText);
    } else {
      // console.error(req.status + " " + req.statusText + " " + url);
    }
  });
  req.addEventListener("error", function () {
    // console.error("Erreur réseau avec l'URL " + url);
  });
  req.send(null);
};
/**
 *
 * @returns if client is on mobile or not
 */
Tools.isMobile = function () {
  console.log(navigator.userAgent);
  let rg = new RegExp(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/gi
  );
  let isMob = rg.test(navigator.userAgent);
  console.log(isMob);
  return isMob;
};

/**
 * Special function for debugging using hash in url
 * @returns the name of the world to load (if no hash return 'moon')
 */
Tools.getHash = function () {
  let world = "moon";
  let hashIsWorld = new RegExp(/moon|europa|titan|mars/);
  if (hashIsWorld.test(window.location.hash.replace("#", ""))) {
    world = window.location.hash.replace("#", "");
  }
  return world;
};

/**
 *
 * @param {hexadecimal} color the hexadecimal color
 * @returns hexadecimal color notation (0x) used by PIXI
 */
Tools.pixiColor = function (color) {
  return color.replace("#", "0x");
};

/**
 *
 * @param {string} elmName the name of the lander sprite
 * @param {int} columns how many columns
 * @param {int} rows how many rows
 * @param {PIXI.Texture} origin the original Texture
 * @returns {JSON} the new sprite sheet in json format
 */
Tools.SpriteSheetAutoSlicer = function (elmName, columns, rows, origin) {
  let frames = {};

  let sH = Math.floor(origin._frame.height / rows);
  let sW = Math.floor(origin._frame.width / columns);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let ox = c * sW;
      let oy = r * sH;
      let x = ox + origin._frame.x;
      let y = oy + origin._frame.y;
      frames[elmName + "_" + i] = {
        frame: { x: x, y: y, w: sW, h: sH },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: sW, h: sH },
        sourceSize: { w: sW, h: sH },
        original: { x: ox, y: oy },
      };
      i++;
    }
  }
  let meta = {
    app: "KWA SpriteSheetAutoSlicer",
    version: "0.1",
    image: `${elmName}.png`,
    format: "RGBA8888",
    size: { w: origin.baseTexture.width, h: origin.baseTexture.height },
    scale: "1",
  };

  return JSON.stringify({ frames, meta });
};

/**
 * #wireFrameFromVertex
 * create an wireframed object for debugging Matter's bodies in Pixi's renderer
 *
 * @param {number} x  position x
 * @param {number} y  position y
 * @param {Array} vertexSets set of vertices
 * @param {boolean} centered for set pivot point to the center of the object
 * @param {hexadecimal} color the color of wireframe lines
 * @returns {PIXI.Graphics} wireframe object
 */
Tools.wireFrameFromVertex = function (
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
  wireFrame.lineStyle(1, Tools.pixiColor(color), 1);
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
    //console.log("CENTERIZATION:", sizeW, sizeH, width, height);
    wireFrame.pivot = { x: width / 2 + sizeW.x, y: height / 2 + sizeH.x };
  }

  return wireFrame;
};

Tools.customText = function (params, center = false) {
  let tf = new PIXI.extras.BitmapText(params.text, {
    font: `${params.fontSize}px ${params.font}`,
    tint: Tools.pixiColor(params.color),
  });
  if (center) {
    tf.align = "center";
    tf.x = params.x - tf.width / 2;
  } else {
    tf.x = params.x;
  }
  tf.y = params.y;
  return tf;
};

/**
 * Tools.dataLoader : mimic the PIXI loader for json data
 * @method add   - register json to load and this name
 * @method once  - register callBack
 * @method load  - start loading
 * @method clean - clean up the Loader
 *
 * @usage Tools.dataLoader.add('name', './url/to/file.json') // declare as many files as you want
 * @usage Tools.dataLoader.once((data)=>{console.log(data)})
 * @usage Tools.dataLoader.load()
 *
 * @usage Tools.dataLoader.clean()  use it if you want to reuse the loader
 */
Tools.dataLoader = (function () {
  var lInst;
  /**
   * create the Loader object instance
   * @returns loader instance
   */
  function createInstance() {
    this.toLoad = [];
    this.data = {};
    this.lID = 0;
    this.xhr = new XMLHttpRequest();
    this.callBack = null;

    /**
     * clean up the Loader
     * @method
     */
    this.clean = function () {
      lInst.xhr = new XMLHttpRequest();
      lInst.toLoad = [];
      lInst.data = {};
      lInst.lID = 0;
      lInst.callBack = null;
    };
    /**
     *
     * @param {string} jsName the access name of the object
     * @param {string} json the url of the json to load
     */
    this.add = function (jsName, json) {
      lInst.toLoad.push([jsName, json]);
    };
    /**
     * Use to register the callBack
     * @param {function} callBack the callBack to call when all the json are loaded
     */
    this.once = function (callBack) {
      lInst.callback = callBack;
    };
    /**
     * Start the loading
     */
    this.load = function () {
      if (lInst.toLoad.length == 0) {
        console.warn(
          "Must add files with Tools.dataLoader.add(name, jsonUri) method before start loading"
        );
        return;
      }
      if (!lInst.callback) {
        console.warn(
          "Must register callBack with Tools.dataLoader.once(callBack) method before start loading"
        );
        return;
      }

      /**
       * load the next json
       */
      function loadNext() {
        lInst.xhr.open("GET", lInst.toLoad[lInst.lID][1]);
        lInst.xhr.send(null);
      }
      /**
       * Go to the next load, or call the registered callBack
       */
      function next() {
        if (lInst.lID < lInst.toLoad.length - 1) {
          lInst.lID++;
          loadNext();
        } else {
          if (lInst.callback) lInst.callback(lInst.data);
        }
      }

      // error listener
      lInst.xhr.addEventListener("error", function () {
        lInst.data[lInst.toLoad[lInst.lID][0]] = {
          error: `something wrong with ${lInst.toLoad[lInst.lID][1]}`,
        };
        next();
      });
      // load listener
      lInst.xhr.addEventListener("load", function () {
        // file does not exist
        if (lInst.xhr.status === 404) {
          lInst.data[lInst.toLoad[lInst.lID][0]] = {
            error: `ERROR: ${lInst.toLoad[lInst.lID][1]} 404 (Not Found)`,
          };
          next();
        }
        // file load complete
        if (lInst.xhr.status >= 200 && lInst.xhr.status < 400) {
          lInst.data[lInst.toLoad[lInst.lID][0]] = JSON.parse(
            lInst.xhr.responseText
          );
          next();
        }
      });
      // start loading
      loadNext();
    };
    // public object returned
    return {
      xhr: this.xhr,
      lID: this.lID,
      data: this.data,
      toLoad: this.toLoad,
      callBack: this.callBack,
      add: this.add,
      once: this.once,
      load: this.load,
      clean: this.clean,
    };
  }

  // auto executed singleton pattern
  return (function () {
    if (!lInst) {
      lInst = createInstance();
    }
    return lInst;
  })();
})();

/**
 * To swap a pixi texture
 * @param {string} textureName the texture to overwrite
 * @param {string} url the new texture to load
 * @param {function} callBack the callback to call after loading new texture
 */

Tools.overwritePixiTexture = function (textureName, url, callBack) {
  let loader = PIXI.loader;
  delete loader.resources[textureName];
  loader.add(textureName, url);
  loader.once("complete", callBack);
};


Tools.getAnimationLoop = function(sprite,from,to) {
  const textures = [];
      for(let i = from; i <= to; i ++){
          const texture = PIXI.Texture.from(`${sprite}${String(i-1).padStart(4,"0")}`);
          textures.push(texture);
      }
      return textures;
}
/* ... end [tools.js] */

/* added by combiner */

/* [Keyboard.js] ... begin */
function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      key.isDown = false;
      key.isUp = true;
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
  }
/* ... end [Keyboard.js] */

/* added by combiner */

/* [Ui.js] ... begin */
/**
 * Create the HUD the values are syncronized on States Singleton object
 * so the refresh is automatic
 */
function Ui() {
  PIXI.Container.call(this);
  this.state = State.getInstance();
  this.fuel = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffffff",
    text: this.state.game.fuel+"/"+this.state.game.fuelMax,
    x: 5,
    y: 5,
  });
  this.speedX = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "vX: 0 m/s",
    x: 5,
    y: 30,
  });
  this.speedY = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "vY: 0 m/s",
    x: 5,
    y: 55,
  });
  this.orientation = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "0deg",
    x: 5,
    y: 80,
  });
  this.shell = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: this.state.game.shell+"%",
    x: 5,
    y: 105,
  });

  // using new display text system
  this.screenInfos = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 40,
    color: "#fffafa",
    text: "Get Ready",
    x: 400,
    y: 40,
  },true);
  this.addChild(this.screenInfos);
}
Ui.prototype = Object.create(PIXI.Container.prototype);

Ui.prototype.createTextField = function (params) {
  let tf = new PIXI.extras.BitmapText(params.text, {
    font: `${params.fontSize}px ${params.font}`,
    tint: Tools.pixiColor(params.color),
  });
  tf.dirty = true;
  this.addChild(tf);
  tf.x = params.x;
  tf.y = params.y;
  return tf;
};


Ui.prototype.updateTextField = function (tf, text, tint = null, centered = false) {
  tf.text = text;
  if(tint && tf._font.tint != tint){
    tf._font.tint  = tint;
  }
  if(centered){
    tf.x = 400 - (tf.width/2)
  }
};

Ui.prototype.update = function () {
  this.updateTextField(
    this.fuel,
    Math.floor(this.state.game.fuel) + "/" + this.state.game.fuelMax,
    Tools.pixiColor((Math.abs(this.state.game.fuel)>= 50)?"#00ff00":"#ff0000")
  );
  this.updateTextField(
    this.speedX,
    "vX: " + Math.floor(this.state.game.speedX * 25) + " m/s",
    getTint((this.state.game.speedX * 25), this.state.game.speedMax)
  );
  this.updateTextField(
    this.speedY,
    "vY: " + Math.floor(this.state.game.speedY * 25) + " m/s",
    getTint((this.state.game.speedY * 25), this.state.game.speedMax)
  );
  
  this.updateTextField(
    this.orientation,
    Math.floor(this.state.game.orientation) + " deg",
    getTint(this.state.game.orientation, 30)
  );
  
  this.updateTextField(
    this.shell,
    (Math.floor(this.state.game.shell) + "%"),
    Tools.pixiColor((Math.abs(this.state.game.shell)>= 50)?"#00ff00":"#ff0000")
  );

  function getTint(val, valMax) {
    let tint = Tools.pixiColor((Math.abs(val)<= valMax)?"#00ff00":"#ff0000")
    return tint;
  }
};



/* ... end [Ui.js] */

/* added by combiner */

/* [Level.js] ... begin */
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
  this.rules = [];
  this.callBack = callBack;

  this.landerExploded = null;

  this.stage.addChild(this);

  this.tweenRule = null;

  // TODO: gerer les landzones ds les json

  // overwrite settings
  this.overWriteSettings(this.data.levels[this.state.game.currentLevel]);
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
  this.applyRules();

  // collisions
  this.addCollisions();
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
      // rules
      console.log(pair.bodyA, pair.bodyB);
      me.rules.forEach((r) => {
        if (pair.bodyA === r.body) {
          me.getRules(r);
        } else if (pair.bodyB === r.body) {
          me.getRules(r);
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
  this.state.log(this.lander.sprite.params.sprite);  

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
Level.prototype.getRules = function (rule) {
  // console.log('getRules', rule.type, rule.params);
  // ici appliquer les rules > static
  RulesSetter.set(this.lander, rule);
}
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
      this.damageLander();
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
  this.state.log(this.engine.world.gravity);
  if(this.data.levels[this.state.game.currentLevel].rules){
    let params = this.data.levels[this.state.game.currentLevel].rules.params;
    let type = this.data.levels[this.state.game.currentLevel].rules.type;
    switch (type) {
      case "gravity_change":
        // #gravityRule
        console.log('GRAVITY_CHANGE');
        
        this.tweenRule = new GravityChange(this.engine, params);
        break;
        case "dust_devils":
          // #gravityRule
          console.log('DUST DEVILS');
          let dd = new DustDevils(type,params);
          this.addChild(dd.sprite);
          if (this.state.isDebug) {
            this.addChild(dd.wireframe);
          }
          // let d =  { body: dd.body, sprite: dd.sprite, wireFrame: dd.wireframe }
          this.rules.push(dd);
          dd.init();
          

          // let params = this.data.levels[this.state.game.currentLevel].rules.params;
          /*
          this.tweenRule = gsap.fromTo(
            dd.sprite,
            {
              x: 0,
              duration: params.duration,
              repeat: params.repeat,
              yoyo: true,
              // ease: "back.in(2)",
            },
            {
              x: 800,
              duration: params.duration,
              repeat: params.repeat,
              yoyo: true,
              // ease: "back.out(2)",
            }
          );
           */
          break;

      default:
        break;
    }
  }
}
/**
 * update / game loop
 */
Level.prototype.updateRules = function () {
  this.rules.forEach(r => {
    //r.update();
    r.sprite.position = r.body.position;
    r.wireframe.position = r.body.position;

    //this.state.log('DUST DEVILS', r.body.position, r.wireframe.position, r.sprite.position);
  });
}
Level.prototype.update = function () {
  this.updateLander();
  this.updateStars();
  this.updateBonus();
  this.updateRules();
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
    this.state.log(m.lander.body);
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
    this.malus.map((m) => m.body),
    this.rules.map((r) => r.body),
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
        setTimeout(()=>{me.state.isPause = true;},20);
        
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

/* ... end [Level.js] */

/* added by combiner */

/* [RulesSetter.js] ... begin */
/**
 * Apply rules forces on lander 
 */

var RulesSetter = RulesSetter || {};

RulesSetter.set = function(lander, rule){
  switch (rule.type) {
    case 'dust_devils':
        RulesSetter.getDustDevils(lander, rule);
      break;
  
    default:

      break;
  }
}

// Mars Rules 
RulesSetter.getDustDevils = function(lander, rule) {
  console.log('RulesSetter type DUST DEVILS', rule.params)

}
/* ... end [RulesSetter.js] */

/* added by combiner */

/* [GravityChange.js] ... begin */
function GravityChange(engine, params) {
  return gsap.fromTo(engine.world.gravity, params.from,params.to);
}

/* ... end [GravityChange.js] */

/* added by combiner */

/* [DustDevils.js] ... begin */
function DustDevils (type, params) {
  this.type = type;
  this.params = params;
  this.sprite = this.createSprite(this.params.size);
  this.body = this.createBody(this.params);
  this.wireframe = this.createWireFrame(this.params.size, this.params.dustPart);
  this.tween;
}
/**
 * debug wireframe
 */
DustDevils.prototype.createWireFrame = function (size, dustPart) {
  let vSet = [
    { "x": -(dustPart.w*0.5)/2, "y": 0 },
    { "x": -dustPart.w/2, "y": -(dustPart.h*size) },
    { "x": dustPart.w/2, "y": -(dustPart.h*size) },
    { "x": (dustPart.w*0.5)/2, "y": 0 }
  ]
  return Tools.wireFrameFromVertex(0, 0, vSet);
}
/**
 * gsap tween
 */
DustDevils.prototype.createTween = function (params) {
  const me = this;
  return gsap.fromTo(
    me.body.position,
    {
      x: 0,
      duration: params.duration,
      repeat: params.repeat,
      yoyo: true,
      repeatRefresh: true,
      ease: "sine.inOut",
    },
    {
      x: 800,
      duration: params.duration,
      repeat: params.repeat,
      yoyo: true,
      repeatRefresh: true,
      ease: "sine.inOut",
    }
  );
}
/**
 * Pixi animated Sprite
 */
DustDevils.prototype.createSprite = function (size=10) {
  let c = new PIXI.Container();
  for (let i = 0; i < size; i++) {
    // calculate to review
    let scaleX = (((i+1)/size)*0.5)+0.5;
    State.getInstance().log(scaleX);
    let s = this.getDDPart({x:scaleX,y:1}) ;
    c.addChild(s);
    s.y = i * -this.params.dustPart.h;
  }
  let p = this.getProjection()
  c.addChild(p);
  c.filters = [new PIXI.filters.BlurFilter(2,3,3)]
  return c;
}

DustDevils.prototype.getProjection = function () {
  const me = this;
  let s = new PIXI.extras.AnimatedSprite(Tools.getAnimationLoop('dust_projections',1,4))
  s.anchor.set(0.5,1);
  s.ticker = PIXI.ticker.shared;
	s.ticker.speed = 0.25;
  s.gotoAndPlay(Tools.randomBetween(0,4));
  
  // gsap.fromTo(s, {x:0,duration:0.5,repeat:-1,yoyo:true},{x:()=>{return Tools.randomBetween(-me.params.gap,me.params.gap)},duration:()=>{return Tools.randomBetween(0.5,1)},repeat:-1,repeatRefresh: true,yoyo:true});
  return s;
}
DustDevils.prototype.getDDPart = function (scale = {x:1,y:1}) {
  const me = this;
  let s = new PIXI.extras.AnimatedSprite(Tools.getAnimationLoop('dust',1,4))
  s.anchor.set(0.5);
  s.ticker = PIXI.ticker.shared;
	s.ticker.speed = 0.25;
  s.gotoAndPlay(Tools.randomBetween(0,4));
  s.scale = scale;
  gsap.fromTo(s, {x:0, duration:0.5, repeat:-1, yoyo:true},{x:()=>{return Tools.randomBetween(-me.params.gap,me.params.gap)},duration:()=>{return Tools.randomBetween(0.5,1)},repeat:-1,repeatRefresh: true,yoyo:true});
  return s;
}
/**
 * Matter Body
 */
DustDevils.prototype.createBody = function (params) {
  let vSet = [
    { "x": -(params.dustPart.w*0.5)/2, "y": 0 },
    { "x": -params.dustPart.w/2, "y": -(params.dustPart.h*params.size) },
    { "x": params.dustPart.w/2, "y": -(params.dustPart.h*params.size) },
    { "x": (params.dustPart.w*0.5)/2, "y": 0 }
  ]
  
  let b = Matter.Bodies.fromVertices(params.position.x, params.position.y, vSet, {isStatic: true, isSensor: true})
  // this.params.partHeight
  return b;
}
// initialization 
DustDevils.prototype.init = function () {
  
  this.sprite.position = this.params.position;
  this.wireframe.position = this.params.position;
  this.body.position = this.params.position;
  this.tween = this.createTween(this.params);
}
// loop update
DustDevils.prototype.update = function () {

  
}


/* ... end [DustDevils.js] */

/* added by combiner */

/* [Flag.js] ... begin */
/**
 * Create the lander flag animation
 * @param {object} params the lander parameters 
 * @class PIXI.extras.AnimatedSprite
 */
function Flag(params){
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,35),true);
    this.anchor.set(0,1)
    this.ticker = PIXI.ticker.shared;
	this.ticker.speed = 0.25;
    this.gotoAndPlay(0);
}
/**
 * proto
 */
Flag.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

/**
 * mini Texture Factory for flag animation
 * @param {int} from the starting key frame animation
 * @param {int} to  the ending key frame animation
 * @returns 
 */
Flag.prototype.getAnimationLoop = function(from,to) {
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
// /!\ don't create update function for AnimatedSprite  it will overwrite the original /!\

/* ... end [Flag.js] */

/* added by combiner */

/* [Stabilizer.js] ... begin */
/**
 * Create the Stabilizers animated Sprite 
 * @param {object} params the lander object parameters from json
 * @class PIXI.extras.AnimatedSprite
 */
function Stabilizer(params){
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,8));
    
    this.anchor.set(1,0)
    this.ticker = PIXI.ticker.shared;
	this.ticker.speed = 0.25;
    this.gotoAndPlay(0);
    this.visible = false;
    console.log(this);
}
/**
 * proto
 */
Stabilizer.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

/**
 * mini texture  Factory for reactor animation
 * @param {int} from the starting animation key frame id
 * @param {int} to the ending animation key frame id 
 * @returns an array of textures for this animation
 */
Stabilizer.prototype.getAnimationLoop = function(from,to) {
    
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
// /!\ ne pas créer de function update pour les AnimatedSprite /!\
/* ... end [Stabilizer.js] */

/* added by combiner */

/* [Reactor.js] ... begin */
/**
 * Create the Reactor
 * @param {object} params the lander params 
 * @class PIXI.extras.AnimatedSprite
 */
function Reactor(params){
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,14),true);
    
    this.anchor.set(0.5,0);
    this.gotoAndPlay(0);
    this.visible = false;

}
/**
 * proto
 */
Reactor.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

/**
 * mini texture  Factory for reactor animation
 * @param {int} from the starting animation key frame id
 * @param {int} to the ending animation key frame id 
 * @returns an array of textures for this animation
 */
Reactor.prototype.getAnimationLoop = function(from,to) {
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
// /!\ ne pas créer de function update pour les AnimatedSprite /!\

/* ... end [Reactor.js] */

/* added by combiner */

/* [LanderBody.js] ... begin */
/**
 * Create the matter physic bodie for the lander from the json params
 * @param {object} params the lander params 
 * @returns the Matter.Body object
 */
function LanderBody (params) {
    this.box = null;
  // create the box for lander
if(params.vertices){
    this.box = Matter.Bodies.fromVertices(
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
} else{
    this.box = Matter.Bodies.rectangle(
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
}

  return this.box;
}
/* ... end [LanderBody.js] */

/* added by combiner */

/* [BonusSprite.js] ... begin */
/**
 * Create a bonus
 * @class PIXI.Container
 */
function BonusSprite(type, amount){
  PIXI.Container.call(this);

  this.graphic = new PIXI.Sprite(PIXI.Texture.from(`bonus_${type}0000`))
  this.graphic.anchor.set(0.5);
  this.addChild(this.graphic);
  let tAmount = (amount + ""); // cast to string
  this.tfAmount = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 20,
    color: BonusSprite.colorFromType[type],
    text: tAmount,
    x: Math.ceil(-((tAmount.length)*10)/2),
    y: -10,
  });
  this.tfAmount.interactive = true;
  this.tfAmount.buttonMode = true;
  this.addChild(this.tfAmount);
  State.getInstance().log(this);
}
/**
 * proto
 */
BonusSprite.prototype = Object.create(PIXI.Container.prototype)


BonusSprite.colorFromType = {
  fuel:"#f7afaf"
}

/* ... end [BonusSprite.js] */

/* added by combiner */

/* [Lander.js] ... begin */
/**
 * Create a lander
 * @param {PIXI.Container} stage the PIXI stage
 * @param {object} params the lander params
 * @class PIXI.extras.AnimatedSprite 
 */
function Lander(stage, params) {
  this.params = params;
  PIXI.extras.AnimatedSprite.call(this, [
    PIXI.Texture.EMPTY
  ]);
  this.stabilizers = [];
  this.reactor = null;
  this.shell = null;
  this.flag = null;

  this.addStabilizers(this.params.stabilizers);
  this.addReactor(this.params.reactor);
  this.addShell(this.params.sprite);
  this.addFlag(this.params.flag);

  this.gotoAndPlay(0);
  stage.addChild(this);
}
/**
 * proto
 */
Lander.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

/**
 * Create the shell sprite
 * and apply shell params
 * @param {string} sprite the sprite name 
 */
Lander.prototype.addShell = function (sprite) {
  let s = new PIXI.Sprite(PIXI.Texture.from(sprite));
  this.addChild(s);
  s.anchor.set(0.5);
  this.shell = s;
};
/**
 * Create the flag sprite
 * and apply flag params
 * @param {object} params the sprite parameters from json
 */
Lander.prototype.addFlag = function (params) {
  let f = new Flag(params);
  f.x = params.x;
  f.y = params.y;
  if (params.rotation) {
    f.rotation = params.rotation;
  }
  this.addChild(f);
  f.visible = false;
  this.flag = f;
};
/**
 * Create the reactor sprite
 * and apply reactor params
 * @param {object} params the sprite parameters from json 
 */
Lander.prototype.addReactor = function (params) {
  let r = new Reactor(params);
  r.x = params.x;
  r.y = params.y;
  this.addChild(r);
  this.reactor = r;
};

/**
 * Create the stabilizers sprite
 * and apply stabilizers params
 * @param {object} parshowams the sprite parameters from json 
 */ 
Lander.prototype.addStabilizers = function (params) {
  params.forEach((stab) => {
    let s = new Stabilizer(stab);
    s.x = stab.x;
    s.y = stab.y;
    if (stab.rotation) {
      s.rotation = stab.rotation;
    }
    this.addChild(s);
    this.stabilizers.push(s);
  });
};

/**
 * the refresh loop
 */
Lander.prototype.update = function () {
  // useless ??
};

/**
 * hide flag
 */
Lander.prototype.hideFlag = function () {
  this.flag.visible = false;
};
/**
 * show flag
 */
Lander.prototype.showFlag = function () {
  this.flag.visible = true;
};

/**
 * hide reactor sprite
 */
Lander.prototype.hideReactor = function () {
  this.reactor.visible = false;
};
/**
 * show reactor sprite
 */
Lander.prototype.showReactor = function () {
  this.reactor.visible = true;
};


/**
 * hide right Stabilizers sprite
 */
Lander.prototype.hideStabilizersRight = function () {
  for (let s = 0; s < this.stabilizers.length / 2; s++) {
    const stab = this.stabilizers[s];
    stab.visible = false;
  }
};

/**
 * show right Stabilizers sprite
 */
Lander.prototype.showStabilizersRight = function () {
  for (let s = 0; s < this.stabilizers.length / 2; s++) {
    const stab = this.stabilizers[s];
    stab.visible = true;
  }
};


/**
 * hide left Stabilizers sprite
 */
Lander.prototype.hideStabilizersLeft = function () {
  for (let s = this.stabilizers.length / 2; s < this.stabilizers.length; s++) {
    const stab = this.stabilizers[s];
    stab.visible = false;
  }
};

/**
 * show left Stabilizers sprite
 */
Lander.prototype.showStabilizersLeft = function () {
  for (let s = this.stabilizers.length / 2; s < this.stabilizers.length; s++) {
    const stab = this.stabilizers[s];
    stab.visible = true;
  }
};

/* ... end [Lander.js] */

/* added by combiner */

/* [Landers.js] ... begin */
/**
 * #LandersFactory
 * 
 * Provide a factory to generate landers object {bodies; wireframe; sprite}
 * And the exploded version of the lander when it die {bodies, sprite}
 * @static
 */

var Landers = Landers || {};


/**
 * Generate the lander
 * @param {Object} landerData the data of the lander cf: (moon|mars|europa|titan).json
 */
Landers.create = function (landerData, level) {
  function PhysicsObject(params) {
    let box = new LanderBody(params);
    let wireFrame;
    // create the box for lander
    if (params.vertices) {
      wireFrame = Tools.wireFrameFromVertex(
        params.x,
        params.y,
        params.vertices,
        true,
        "#08fff2"
      );
    } else {
      // vertices from rectangle
      let vertexSet = [
        { x: params.x, y: params.y },
        { x: params.width, y: params.y },
        { x: params.width, y: params.height },
        { x: params.x, y: params.height },
        { x: params.x, y: params.y },
      ];
      wireFrame = Tools.wireFrameFromVertex(
        params.x,
        params.y,
        vertexSet,
        true,
        "#08fff2"
      );
    }

    return { box, wireFrame };
  }

  // Object Lander : sprite + body + wireframe
  var createLander = function () {
    let b = new PhysicsObject(landerData.physic);
    return {
      sprite: new Lander(level, landerData.sprite),
      body: b.box,
      wireFrame: b.wireFrame,
    };
  };

  return createLander();
}


/**
 * #explosion
 * Generate the exploded version of the current lander 
 * @param {Lander} lander the current instance of the lander in game 
 * @param {int} level the current level ID
 * @param {function} callBack return the exploded lander {bodies, sprites}
 */
Landers.explode = function (lander, level, callBack) {

  // get the Texture from the current lander
  let textSS = PIXI.Texture.from(lander.sprite.params.sprite);
  
  // generate a new atlas and parse it
  let dataSS = Tools.SpriteSheetAutoSlicer("lander", 5, 5, textSS);
  let data = JSON.parse(dataSS);
  
  // create the new sprite sheet from the texture and the atlas
  let spLander = new PIXI.Spritesheet(textSS.baseTexture, data);
  
  // stack Object size from the sliced lander 
  let stackObjSize = {};
  // sheet stack references
  let sStack = [];

  // parse the sprite sheet (generate all sprites references)
  spLander.parse((result) => {
    // SPRITES PART //
    // create a new container for all parts of the sliced lander
    let c = new PIXI.Container();

    // create lander parts sprites
    // and add them to the container
    Object.keys(data.frames).forEach((key, i) => {
      if (i == 0) {
        // reference the size
        stackObjSize.width = data.frames[key].sourceSize.w;
        stackObjSize.height = data.frames[key].sourceSize.h;
      }
      // create the sprite and place it in the container
      let s = new PIXI.Sprite(result[key]);
      s.anchor.set(0.5);
      s.position = data.frames[key].original;
      c.addChild(s);
      sStack.push(s);
    });
    
    // BODIES PART //
    // get the position of the stack
    let xx = level.lander.body.position.x - level.lander.sprite.width / 2;
    let yy = level.lander.body.position.y - level.lander.sprite.height / 2;
    // create the Matter stack ann place it
    var stack = Matter.Composites.stack(xx, yy, 5, 5, 0, 0, function (x, y) {
      let b = Matter.Bodies.rectangle(
        x,
        y,
        stackObjSize.width,
        stackObjSize.height,
        {
          restitution: Tools.randomBetween(0.1,0.5)
        }
      );
      // apply Angular Velocity to each parts for create explosion
      Matter.Body.setMass(b, Tools.randomBetween(2,5));
      Matter.Body.setAngularVelocity(b, Math.random() * 2 - 1);
      State.getInstance().log(b);
      return b;
    });

    // rotate the complete stack according to the lander rotation
    Matter.Composite.rotate(stack, level.lander.body.angle, {x:level.lander.body.position.x ,y:level.lander.body.position.y});
    // add the bodies to the engine
    Matter.World.add(level.engine.world, stack.bodies);
    // console.log(stack);
    
    
    // add the container in the level
    level.addChild(c);

    // returning the object after parsing
    callBack({
      bodies: stack.bodies,
      sprites: sStack,
    })
  });
}
/* ... end [Landers.js] */

/* added by combiner */

/* [Terrains.js] ... begin */
/**
 * #TerrainsFactory
 * 
 * Provide a factory to generate terrain object {bodies; wireframe; sprite}
 * @static
 */

var Terrains = Terrains || {};
/**
 * Terrains.load get the url of the svg ; load it and call Terrains.create 
 * to generate a terrain
 * 
 * @param {Object} levelParams the object level from json
 * @param {int} currentLevel  the current level ID
 * @param {function} callBack  return the new terrain
 */
Terrains.load = function (levelParams,currentLevel, callBack) {
  if (Tools === undefined) {
    throw new Error('Must have Tools.js')
  }
  Tools.ajaxGet(levelParams.terrain, (data) => {
    // let d = JSON.parse(data);
    Terrains.create(data, levelParams.centerOfMass,currentLevel, callBack);

  });
}
/**
 * create, set and add terrain from svg data
 * 
 * @param {SVG} data svg terrain raw data
 * @param {Point} centerOfMass  center of mass position point
 * @param {int} currentLevel  the current level ID
 * @param {function} callBack  return the new terrain
 */
Terrains.create = function (data, centerOfMass,currentLevel, callBack) {

  
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
    console.log("vertexSets:", vertexSets);

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
    let wireFrame = Tools.wireFrameFromVertex(360, 1290, vertexSets);
    return { terrain, wireFrame };
  }
  // creation of the obejct terrain  sprite + body + wireframe
  var createTerrain = function (data) {
    let b = new PhysicsObject(data);
    return {
      sprite: new PIXI.Sprite(
        PIXI.Texture.from(`terrain${currentLevel}`)
      ),
      body: b.terrain,
      wireFrame: b.wireFrame,
    };
  };

  let terrain = createTerrain(data);
  
  callBack(terrain);
}
/* ... end [Terrains.js] */

/* added by combiner */

/* [ButtonSprite.js] ... begin */
/**
 * Create a button to display in the menu
 * @param {int} levelID the level id
 * @class PIXI.Sprite
 */
function ButtonSprite(levelID) {
  PIXI.Sprite.call(this,PIXI.Texture.from("ui_button_nb0000"));
  this.state = State.getInstance();

  this.outed();

  let txt = levelID+"";
  this.text = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 30,
    color: "#fffafa",
    text: txt,
    x: Math.ceil(-((txt.length)*15)/2),
    y: -15,
  })
  this.addChild(this.text);
  this.interactive = true;
  this.buttonMode= true;
}
/**
 * proto
 */
ButtonSprite.prototype = Object.create(PIXI.Sprite.prototype)

/**
 * mouseover button state
 */
ButtonSprite.prototype.overed = function() {
  this.tint = Tools.pixiColor(this.state.menuData.bg[Tools.getHash()].tintOver)
}
/**
 * mouseout button state
 */
ButtonSprite.prototype.outed = function() {
  this.tint = Tools.pixiColor(this.state.menuData.bg[Tools.getHash()].tint)
}
/* ... end [ButtonSprite.js] */

/* added by combiner */

/* [Button.js] ... begin */

/**
 * 
 * @param {int} index the button index relative to the level to start
 * @param {Point} position the position of the current button
 * @class PIXI.Container
 */
function Button(index,position) {
  PIXI.Container.call(this)
  this.index = index;
  this.pos = position;
  const me = this;
  this.hiddenPos = {x:this.pos.x-800, y:this.pos.y};
  this.bt = new ButtonSprite(index+1)//new PIXI.Sprite(PIXI.Texture.from("ui_button0000"))
  this.bt.on('click', (this.emit.bind(this)))
  this.bt.on('mouseover', ()=>{
    me.bt.overed()
  })
  this.bt.on('mouseout', ()=>{
    me.bt.outed()
  })
  this.bt.anchor.set(0.5);
  this.addChild(this.bt);
  this.body = this.addPhysic(position)
  this.starsSprites = this.createStars(this.body)

  this.comeIn()
  this.emitter = new PIXI.utils.EventEmitter();
  this.emitterContext = {id:this.index}
}
/**
 * proto
 */
Button.prototype = Object.create(PIXI.Container.prototype);

/**
 * Comein animation
 */
Button.prototype.comeIn = function(){
  const me = this;
  gsap.to(me.getBtPhysic().position,{x:(this.pos.x),duration:2, delay: ((me.index+1)*0.15), ease:'elastic.out(1, 0.5)'})
}
/**
 * the call to emit start level event
 */
Button.prototype.emit = function(){
  this.emitter.emit('out',this.emitterContext )
}

/**
 * come out animation
 */
Button.prototype.comeOut = function(){
  const me = this;
  gsap.to(me.getBtPhysic().position,{x:(this.pos.x+800),duration:1/*, delay: ((me.index+1)*0.15)*/, ease:'elastic.in(1, 0.75)'})
}

/**
 * Add the physic for this button
 * create a composite ( container )
 * add
 * - rigid static body
 * - 3 constaints
 * - 3 'start' bodies 
 * @returns {Matter.Composite} to add it in the physic world
 */
Button.prototype.addPhysic = function() {
  let comp = Matter.Composite.create();
  let anchor = Matter.Bodies.circle(this.hiddenPos.x,this.pos.y,5,{isStatic:true,label:'button',collisionFilter: { group: this.index }});
  Matter.Composite.add(comp, [anchor]);
  // Matter.Composite.add(comp, [anchor,constraint]);
  let star1 = Matter.Bodies.polygon(this.hiddenPos.x-30,this.pos.y+40,5,20,{label:'star1',density:10,restitution:0,collisionFilter: { group: this.index }});
  let star2 = Matter.Bodies.polygon(this.hiddenPos.x,this.pos.y+50,5,20,{label:'star2',density:10,restitution:0,collisionFilter: { group: this.index }});
  let star3 = Matter.Bodies.polygon(this.hiddenPos.x+30,this.pos.y+40,5,20,{label:'star3',density:10,restitution:0,collisionFilter: { group: this.index }});
  let constraint1 = this.createConstraint(anchor,star1);
  let constraint2 = this.createConstraint(anchor,star2);
  let constraint3 = this.createConstraint(anchor,star3);
  
  Matter.Composite.add(comp, [star1, constraint1]);
  Matter.Composite.add(comp, [star2, constraint2]);
  Matter.Composite.add(comp, [star3, constraint3]);
  return comp;

}

/**
 * Matter.Constaint Factory for the stars
 * @param {Matter.body} bodyA the firt body
 * @param {Matter.body} bodyB the second body to link
 * @returns Matter.Constraint
 */
Button.prototype.createConstraint = function(bodyA, bodyB) {
  return Matter.Constraint.create({
    bodyA: bodyA,
    pointA: { x: 0, y: 0 },
    bodyB: bodyB,
    pointB: { x: 0, y: -5 },
    stiffness: 0.6,
  });
}
/**
 * 
 * @param {Matter.Container} body the physic bodies reference of the button and stars 
 * @returns an Array of stars sprites
 */
Button.prototype.createStars = function(body) {
  let starsSprite = []
  let regEx = new RegExp('star')
  let starsB = body.bodies.filter(b => regEx.test(b.label))
  starsB.forEach(star => {
    let sSprite = new PIXI.Sprite( PIXI.Texture.from("ui_star0000"))
    starsSprite.push(sSprite)
    sSprite.anchor.set(0.5)
    sSprite.position = star.position;
    this.addChild(sSprite)
  });
  return starsSprite
}


/**
 * the refresh loop 
 */
Button.prototype.update = function (){
  const me = this  
  let starsB = this.getStarsPhysic();
  starsB.forEach((star,i) => {
    me.starsSprites[i].position = star.position;
    me.starsSprites[i].rotation = star.angle;
  });
  
  me.bt.position = this.getBtPhysic().position
  me.bt.rotation = this.getBtPhysic().angle
}

/**
 * Accessor for the physic body of the button
 * @returns Matter.body the button body
 */
Button.prototype.getBtPhysic = function(){
  let regEx2 = new RegExp('button')
  let buttonB = this.body.bodies.filter(b => regEx2.test(b.label));
  return buttonB[0];
}
/**
 * Accessor for the physic stars
 * @returns an Array of Physic stars
 */
Button.prototype.getStarsPhysic = function(){
  let regEx = new RegExp('star')
  let starsB = this.body.bodies.filter(b => regEx.test(b.label))
  return starsB;
}
/* ... end [Button.js] */

/* added by combiner */

/* [MenuBg.js] ... begin */

/**
 * Create the background of the menu
 * @param {int} world the world Id 
 * @class PIXI.Container
 */
function MenuBg (world) {
  PIXI.Container.call(this)
  this.state = State.getInstance();
  this.sprites = []

  this.displayElements(world);
}
/**
 * proto
 */
MenuBg.prototype = Object.create(PIXI.Container.prototype)

/**
 * create and display background sprites from the state data
 * @param {int} world the world id 
 */
MenuBg.prototype.displayElements = function(world) {
  const me = this
  this.state.menuData.bg[world].sprites.forEach(spriteInfos => {
    let s = new PIXI.Sprite(PIXI.Texture.from(spriteInfos.name))
    s.anchor.set(.5)
    s.position = spriteInfos.position
    if(spriteInfos.tint){
      s.tint = Tools.pixiColor(spriteInfos.tint);
    }
    if(spriteInfos.scale){
      s.scale = spriteInfos.scale;
    }
    if(spriteInfos.filter){
      switch (spriteInfos.filter.type) {
        case 'blur':
          default:
          let f = new PIXI.filters.BlurFilter(spriteInfos.filter.size,3,3);
          f.autoFit = true;
          s.filters = [f];      
          break;
      }
    }
    me.sprites.push(s)
    me.addChild(s)
  });
}



/* ... end [MenuBg.js] */

/* added by combiner */

/* [Menu.js] ... begin */
/**
 * Create the Menu
 * @param {PIXI.Container} stage the PIXI stage
 * @param {Matter.Engine} engine the MatterJs engine
 * 
 * @class PIXI.Container
 */
function Menu(stage,engine) {

  PIXI.Container.call(this);
  this.state = State.getInstance();
  this.engine = engine;
  this.emitter = new PIXI.utils.EventEmitter();
  
  this.bodies = [];
  this.sprites = [];
  this.bg = null;
  let txt = this.state.menuData.bg[Tools.getHash()].quote.replace(/@/g,'"');
  this.quote = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 30,
    color: "#fffafa",
    text: txt,
    x: 400,
    y: 40,
  },true)
  let txtTitle = this.state.menuData.bg[Tools.getHash()].title.replace(/@/g,'"');
  this.title = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 50,
    color: this.state.menuData.bg[Tools.getHash()].tint,
    text: txtTitle,
    x: 400,
    y: 540,
  },true)
  // TODO GET WORLD ID IN OTHER WAY
  this.showMenu(this.state.menuData.worlds.indexOf(Tools.getHash()));
  this.addChild(this.quote);
  this.addChild(this.title);
  stage.addChild(this)
}
/**
 * proto
 */
Menu.prototype = Object.create(PIXI.Container.prototype)

/**
 * Menu construction
 * Set The Bg and create the buttons
 * Create Matter bodies
 * @param {int} worldID the worldId to display
 */
Menu.prototype.showMenu = function (worldID = 0) {
  const me = this
  me.bg = new MenuBg(this.state.menuData.worlds[worldID]);
  me.addChild(me.bg)
  for (let i = 0; i < 10; i++) {
    let position = this.getPosition(i)
    let button = new Button(i,position);
    this.sprites.push(button);
    this.addChild(button);
    this.bodies.push(button.body);
    button.emitter.on('out',me.launchLevel.bind(this));
    
  }
  
  Matter.World.add(me.engine.world, me.bodies);
};


/**
 * #launchLevel
 * launch the menu quit-animation, then emit the start event  with context {id:theLevelIdToStart}
 * @param {object} context the object context 
 */
Menu.prototype.launchLevel = function (context) {
  const me = this;
  console.log(context)

  me.sprites.forEach((b)=>{
    b.comeOut()
  })
  gsap.to(me.bg.position,{x:(me.bg.position.x+800),duration:1,delay:.5, ease:'power4.in',onComplete:me.quitToLevel.bind(me), onCompleteParams:[context]})

}

/**
 * 
 * @param {object} context the context for the start event {id:theLevelIdTOStart}
 */
Menu.prototype.quitToLevel = function (context) {
 console.log('quitToLevel', context);
 this.emitter.emit('start',context)
}

/**
 * Get the position of the button
 * @param {int} index the id of the button
 * @returns {Point} the {x,y} position of the button
 */
Menu.prototype.getPosition = function (index) {
  let margin = 50;
  let spaceLeft = { w: (800 - margin * 2)/5, h: (600 - margin * 2)/3 };
  let c = ((index) % 5)
  // console.log(c)
  let r = ((index) > 4 ? 2 : 1)
  return {x:(spaceLeft.w-(margin/2))+(c*spaceLeft.w ), y:(r*spaceLeft.h ) +(margin/2) }
}


/**
 * Display refreshing loop
 */
Menu.prototype.update = function(){
  this.sprites.forEach((s)=>{
    s.update()
  })
}

/* ... end [Menu.js] */

/* added by combiner */

/* [Main.js] ... begin */
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
  this.loader = PIXI.loader;
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
  
  this.level = null;
  this.menu = null;
  this.loopID = null;
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
  this.showLoader()
  const me = this;
  this.removeMenu();
  this.ui = this.createUi();
  this.state.game.currentLevel = context.id;

  this.level = new Level(this, () => {
    me.level.getAllBodiesInThisLevel().forEach((b) => {
      me.bodies.push(b);
      console.log(b);
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
  
  this.addMouseConstraint();
  console.log('BODIES',this.menu.bodies)
  this.showCanvas();
  this.loopID = requestAnimationFrame(this.updateMenu.bind(this));
}

/**
 * remove and hide the Menu
 */
Main.prototype.removeMenu = function () {
  cancelAnimationFrame(this.loopID);
  this.stage.removeChild(this.menu);
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
  this.showCanvas()
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
/* ... end [Main.js] */

/* added by combiner */
