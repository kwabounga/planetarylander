var Tools = Tools || {};

/**
 * return the real size of the current browser window
 */
Tools.availableSize = {
    width: _=> Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: _=> Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
}
/**
 * randomBetween
 * @param {integer} max 
 * @param {integer} min 
 * @returns a integer between min and max
 */
Tools.randomBetween = function(min=-40, max=40){
    return (Math.random() * (max-min) + min);
  }
/**
 * random boolean
 * @param {integer} max 
 * @returns boolean 
 */
Tools.rb = function(max=15) {
  return !(Math.floor(Math.random()*max) > max/3);
}
/**
 * ajaxGet
 * @param {string} url 
 * @param {function} callback 
 */
Tools.ajaxGet = function(url, callback) {
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
  }
  /**
   * 
   * @returns if client is on mobile or not
   */
  Tools.isMobile = function(){
    console.log(navigator.userAgent)
    let rg = new RegExp(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/ig)
    let isMob = rg.test(navigator.userAgent)
    console.log(isMob)
    return isMob;
  }

  Tools.getHash = function(){
    let world = 'moon';
    let hashIsWorld = new RegExp(/moon|europa|titan|mars/);
    if(hashIsWorld.test(window.location.hash.replace('#',''))){
        world = window.location.hash.replace('#','');                
    }
    return world;
  }
  
  /**
   * 
   * @param {string} elmName the name of the lander sprite
   * @param {int} columns how many columns
   * @param {int} rows how many rows
   * @param {PIXI.Texture} origin the original Texture
   * @returns {JSON} the new sprite sheet in json format
   */
  Tools.SpriteSheetAutoSlicer = function (elmName, columns, rows , origin){
    let frames = {}

    let sH = Math.floor(origin._frame.height/rows)
    let sW = Math.floor(origin._frame.width/columns)
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        let ox = (c * sW)
        let oy = (r * sH)
        let x = ox + origin._frame.x
        let y = oy + origin._frame.y
        frames[elmName + '_' + i] = {
          frame : {x:x,y:y,w:sW,h:sH},
          rotated: false,
          trimmed: false,
          spriteSourceSize : {x:0,y:0,w:sW,h:sH},
          sourceSize:{w:sW,h:sH},
          original:{x:ox,y:oy}
        }
        i++;
      }      
    }
    let meta = {
      app:"KWA SpriteSheetAutoSlicer",
      version:"0.1",
      image:`${elmName}.png`,
      format:"RGBA8888",
      size: {w:origin.baseTexture.width,h:origin.baseTexture.height},
      scale:"1"
    }
    
    return JSON.stringify({frames,meta});
  }

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
      //console.log("CENTERIZATION:", sizeW, sizeH, width, height);
      wireFrame.pivot = { x: width / 2 + sizeW.x, y: height / 2 + sizeH.x };
    }
  
    return wireFrame;
  };


  Tools.customText = function(params) {
    let tf = new PIXI.extras.BitmapText(params.text, {
      font: `${params.fontSize}px ${params.font}`,
      tint: params.color.replace("#", "0x"),
    });
    tf.x = params.x;
    tf.y = params.y;
    return tf;
  }