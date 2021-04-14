/**
 * Terrains
 * 
 * Provide a factory to generate terrain object {bodies; wireframe; sprite}
 * 
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