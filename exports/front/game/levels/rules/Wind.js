function Wind (container, renderer, params) {
    this.ticker = PIXI.ticker.shared;
    this.tick = 0;
    this.params = params;
    this.nbParticles = params.nbParticles;
    this.container = container; 
    this.renderer = renderer; 
    this.direction = this.params.direction;
    this.alpha = 1
    this.timerDirectionChanger = null;
    this.setTimerDirectionChanger();
    this.particleContainerBg = this.setParticlesContainer(this.params,this.params.nbParticles/2, true);
    this.particleContainer = this.setParticlesContainer(this.params,this.params.nbParticles);
    this.container.addChild(this.particleContainerBg);
    this.container.addChild(this.particleContainer);

}

Wind.prototype.Constants = {
  height:2000,
  width:800
}
Wind.prototype.setTimerDirectionChanger = function() {
  const me = this;
  fTimeOut()
  function newTime(){
    return ((Math.random()*5000)+5000);
  }
  function fTimeOut () {
    let nDirection = Math.random() * 90 * Math.PI ;
    // me.direction = (Math.random() * 360) * Math.PI ;
    me.timerDirectionChanger = setTimeout(fTimeOut,newTime())
    console.log('Change wind direction:',me.direction);
    gsap.to(me,{direction:nDirection, duration:.3,repeat:0})
  }
}
Wind.prototype.setParticlesContainer = function(params, nbParticles , isBG = false) {
   const me = this;
    let pContainer = new PIXI.particles.ParticleContainer(nbParticles, {
        scale:true,
        position:true,
        rotation:true,
        alpha:true,
        uvs:true,
    })
    let totalParticles = this.renderer instanceof PIXI.WebGLRenderer ? nbParticles : 100;
    let allP = [];
    let pBoundsPadding = 100;
    for (let i = 0; i < totalParticles; i++) {
        let p = new PIXI.Sprite(PIXI.Texture.from('wind_particle0000'));
        p.anchor.set(.5);
        if(isBG){
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
    
    this.ticker.add(()=>{
        for (let t = 0; t < allP.length; t++) {
            const p = allP[t];
            //p.direction =  me.direction * Math.PI * .5;
            
            p.x += Math.sin(me.direction) * (p.speed * p.scale.y) * (isBG?2:1);
            p.y += Math.cos(me.direction) * (p.speed * p.scale.y) * (isBG?2:1);
            // p.rotation = -p.direction + Math.PI;
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

    // pContainer.position.y = 1000;
    return pContainer;
}
/*
var app = new PIXI.Application();
document.body.appendChild(app.view);

var sprites = new PIXI.particles.ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true
});
app.stage.addChild(sprites);

// create an array to store all the sprites
var maggots = [];

var totalSprites = app.renderer instanceof PIXI.WebGLRenderer ? 500 : 100;

for (var i = 0; i < totalSprites; i++) {
    // create a new Sprite
    var dude = PIXI.Sprite.fromImage('examples/assets/maggot_tiny.png');

    dude.tint = Math.random() * 0xE8D4CD;

    // set the anchor point so the texture is centerd on the sprite
    dude.anchor.set(0.5);

    // different maggots, different sizes
    dude.scale.set(0.8 + Math.random() * 0.3);

    // scatter them all
    dude.x = Math.random() * app.screen.width;
    dude.y = Math.random() * app.screen.height;

    dude.tint = Math.random() * 0x808080;

    // create a random direction in radians
    dude.direction = 90 * Math.PI * 2;

    // this number will be used to modify the direction of the sprite over time
    dude.turningSpeed = Math.random() - 0.8;

    // create a random speed between 0 - 2, and these maggots are slooww
    dude.speed = (2 + Math.random() * 2) * 0.5;

    dude.offset = Math.random() * 100;

    // finally we push the dude into the maggots array so it it can be easily accessed later
    maggots.push(dude);

    sprites.addChild(dude);
}
*/
/*
// create a bounding box box for the little maggots
var dudeBoundsPadding = 100;
var dudeBounds = new PIXI.Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2
);

var tick = 0;

app.ticker.add(function() {
    // iterate through the sprites and update their position
    for (var i = 0; i < maggots.length; i++) {
        var dude = maggots[i];
        dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
        //dude.direction += dude.turningSpeed * 0.01;
        dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
        dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
        // dude.rotation = -dude.direction + Math.PI;

        // wrap the maggots
        if (dude.x < dudeBounds.x) {
            dude.x += dudeBounds.width;
        } else if (dude.x > dudeBounds.x + dudeBounds.width) {
            dude.x -= dudeBounds.width;
        }

        if (dude.y < dudeBounds.y) {
            dude.y += dudeBounds.height;
        } else if (dude.y > dudeBounds.y + dudeBounds.height) {
            dude.y -= dudeBounds.height;
        }
    }

    // increment the ticker
    tick += 0.1;
});
 */