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
