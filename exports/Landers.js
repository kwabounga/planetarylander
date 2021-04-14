/**
 * Landers
 * 
 * Provide a factory to generate landers object {bodies; wireframe; sprite}
 * And the exploded version of the lander when it die {bodies, sprite}
 * 
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
    //console.log("LANDER BODY", box);

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
 * Generate the exploded version 
 * @param {Lander} lander the current instance of the lander in game 
 */
Landers.explode = function (lander) {
  
}