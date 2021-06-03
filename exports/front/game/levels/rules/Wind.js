/**
 * 
 * @param {PIXI.container} container - the container to put particles conainer into
 * @param {PIXI.renderer} renderer - the renderer
 * @param {object} params - the json rules object parameters 
 */
function Wind(container, renderer, params, lander) {
  this.ticker = PIXI.ticker.shared;
  this.tick = 0;
  this.params = params;
  this.nbParticles = params.nbParticles;
  this.container = container;
  this.renderer = renderer;
  this.direction = this.params.direction;
  this.vectorsDirection = {x:0,y:0};
  this.fakeDirectionForTween = this.params.direction;
  this.lander = lander;
  this.alpha = 1
  this.timerDirectionChanger = null;
  this.setTimerDirectionChanger();
  this.particleContainerBg = this.setParticlesContainer(this.params, this.params.nbParticles / 2, true);
  this.particleContainer = this.setParticlesContainer(this.params, this.params.nbParticles);
  this.container.addChild(this.particleContainerBg);
  this.container.addChild(this.particleContainer);

}
/**
 * TODO: Get sizes from States singleton
 */
Wind.prototype.Constants = {
  height: 2000,
  width: 800
}

/**
 * timer definition to change wind direction called in constructor
 */
Wind.prototype.setTimerDirectionChanger = function () {
  const me = this;
  fTimeOut()

  // function time construction
  function newTime() {
    return ((Math.random() * 5000) + 5000);
  }

  // timeout function
  function fTimeOut() {
    // new wind direction
    let nDirection = Math.random() * 360;
    // me.direction = (Math.random() * 360) * Math.PI ;
    // set new timeout function
    me.timerDirectionChanger = setTimeout(fTimeOut, newTime())
    // console.log('Change wind direction:', me.direction,'to:', nDirection );
    // apply tween on fake Direction
    gsap.to(me, { fakeDirectionForTween: nDirection, duration: .3, repeat: 0, onComplete:()=>{
      // set new direction
      me.direction = me.fakeDirectionForTween;
      // transfom Angle Deg to Rad 
      let angleRad = (me.fakeDirectionForTween*Math.PI/180);
      // get new vectors
      let vx = Math.sin(angleRad) * .06;
      let vy = Math.cos(angleRad) * .06;
      // console.log('Set New Vectors:', vx, vy )
      // set vectors direction
      me.vectorsDirection = {x:vx, y:vy};
      
    } })
  }
}

/**
 * 
 * @param {object} params - the rule object parameters
 * @param {int} nbParticles - the number of particles in the container 
 * @param {boolean} isBG - if is background or not
 * @returns {PIXI.particles.ParticleContainer} the container of wind particles
 */
Wind.prototype.setParticlesContainer = function (params, nbParticles, isBG = false) {
  const me = this;
  let pContainer = new PIXI.particles.ParticleContainer(nbParticles, {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
    uvs: true,
  })
  let totalParticles = this.renderer instanceof PIXI.WebGLRenderer ? nbParticles : 100;
  let allP = [];
  let pBoundsPadding = 100;
  for (let i = 0; i < totalParticles; i++) {
    let p = new PIXI.Sprite(PIXI.Texture.from('wind_particle0000'));
    p.anchor.set(.5);
    if (isBG) {
      p.scale.set(0.5 + Math.random() * 0.3);
      p.alpha = Math.random() * .3;
      p.tint = Tools.pixiColor('#ffa500');
    } else {
      p.scale.set(0.8 + Math.random() * 0.3);
      p.alpha = Math.random();
      p.tint = Math.random() * Tools.pixiColor('#808080');
    }
    p.x = Math.random() * me.Constants.width + pBoundsPadding;
    p.y = Math.random() * me.Constants.height + pBoundsPadding;
    p.direction = params.direction * Math.PI;
    p.speed = (2 + Math.random() * 2) * 0.5;
    p.offset = Math.random() * 100;
    // change direction
    p.turningSpeed = Math.random() - 0.8;

    allP.push(p);
    pContainer.addChild(p);
  }

  let pBounds = new PIXI.Rectangle(
    -pBoundsPadding,
    -pBoundsPadding,
    me.Constants.width + pBoundsPadding * 2,
    me.Constants.height + pBoundsPadding * 2
  );

  // the loop using ticker to refresh particles position and direction
  this.ticker.add(() => {
    // out of game
    if(!State.getInstance().gameStarted) {
      return;
    }

    // apply force to lander with wind vectors direction
    Matter.Body.applyForce(
      me.lander.body,
      { x: me.lander.body.position.x -=me.vectorsDirection.x, y: me.lander.body.position.y-=me.vectorsDirection.y },
      { x: 0, y: 0 }
    );

    // Update Wind particles positions and rotation
    for (let t = 0; t < allP.length; t++) {
      const p = allP[t];
      p.x += Math.sin(me.direction) * (p.speed * p.scale.y) * (isBG ? 2 : 1);
      p.y += Math.cos(me.direction) * (p.speed * p.scale.y) * (isBG ? 2 : 1);
      if (p.x < pBounds.x) {
        p.x += pBounds.width;
      } else if (p.x > pBounds.x + pBounds.width) {
        p.x -= pBounds.width;
      }

      if (p.y < pBounds.y) {
        p.y += pBounds.height;
      } else if (p.y > pBounds.y + pBounds.height) {
        p.y -= pBounds.height;
      }
      this.tick += 0.1;
    }
  })

  
  return pContainer;
}