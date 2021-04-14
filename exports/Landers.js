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
 * Generate the exploded version of the current lander 
 * @param {Lander} lander the current instance of the lander in game 
 */
Landers.explode = function (lander, level, callBack) {
  let textSS = PIXI.Texture.from(lander.sprite.params.sprite);
  // console.log("textSS",textSS,textSS._frame);
  let dataSS = Tools.SpriteSheetAutoSlicer("lander", 5, 5, textSS);
  // console.log("dataSS", dataSS);
  let data = JSON.parse(dataSS);
  // console.log("dataSS", data);
  let spLander = new PIXI.Spritesheet(textSS.baseTexture, data);
  // console.log("spLander",spLander)
  let stackObjSize = {};
  let sStack = [];
  spLander.parse((result) => {
    // console.log(result)

    let c = new PIXI.Container();
    Object.keys(data.frames).forEach((key, i) => {
      if (i == 0) {
        stackObjSize.width = data.frames[key].sourceSize.w;
        stackObjSize.height = data.frames[key].sourceSize.h;
      }
      // console.log(key, data.frames[key]);
      let s = new PIXI.Sprite(result[key]);
      s.anchor.set(0.5);
      s.position = data.frames[key].original;
      // console.log(s)
      c.addChild(s);
      sStack.push(s);
    });
    
    let xx = level.lander.body.position.x - level.lander.sprite.width / 2;
    let yy = level.lander.body.position.y - level.lander.sprite.height / 2;
    var stack = Matter.Composites.stack(xx, yy, 5, 5, 0, 0, function (x, y) {
      let b = Matter.Bodies.rectangle(
        x,
        y,
        stackObjSize.width,
        stackObjSize.height
      );
      Matter.Body.setAngularVelocity(b, Math.random() * 2 - 1);
      return b;
    });

    
    Matter.Composite.rotate(stack, level.lander.body.angle, {x:level.lander.body.position.x ,y:level.lander.body.position.y});
    Matter.World.add(level.engine.world, stack.bodies);
    console.log(stack);
    
    
    console.log(level.landerExploded);
    // c.position = level.lander.sprite.position;
    // c.rotation = level.lander.sprite.rotation;
    level.addChild(c);

    // returning the object after parsing
    callBack({
      bodies: stack.bodies,
      sprites: sStack,
    })
  });
}