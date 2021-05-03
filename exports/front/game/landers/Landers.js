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