function Wind (stage, renderer, params) {
    this.ticker = PIXI.ticker.shared;
    this.tick = 0;
    this.nbParticles = params.nbParticles;
    this.stage = stage; 
    this.renderer = renderer; 
    this.particleContainer = this.setParticlesContainer(this.nbParticles);
    this.stage.addChild(this.particleContainer);
}
Wind.prototype.setParticlesContainer = function(nbParticles) {
    let pContainer = new PIXI.particles.ParticleContainer(nbParticles, {
        scale:true,
        position:true,
        rotation:true,
        alpha:true,
        uvs:true,
    })
    let totalParticles = this.renderer instanceof PIXI.WebGLRenderer ? 500 : 100;
    let allP = [];
    for (let i = 0; i < totalParticles; i++) {
        let p = new PIXI.Sprite(PIXI.Texture.from('particle'));
        p.anchor.set(.5);
        p.scale.set(0.8 + Math.random() * 0.3);
        p.x = Math.random() * 800;
        p.y = Math.random() * 600;
        p.tint = Math.random() * 0x808080;
        p.direction = 45 * Math.PI * 2;
        p.speed = (2 + Math.random() * 2) * 0.5;
        p.offset = Math.random() * 100;
        allP.push(p);
        pContainer.addChild(p);
    }
    let dudeBoundsPadding = 100;
    let dudeBounds = new PIXI.Rectangle(
        -dudeBoundsPadding,
        -dudeBoundsPadding,
        800 + dudeBoundsPadding * 2,
        600 + dudeBoundsPadding * 2
    );
    
    this.ticker.add(()=>{
        for (let t = 0; t < allP.length; t++) {
            const p = allP[t];
            p.x += Math.sin(p.direction) * (p.speed * p.scale.y);
            p.y += Math.cos(p.direction) * (p.speed * p.scale.y);
            if (p.x < dudeBounds.x) {
                p.x += dudeBounds.width;
            } else if (p.x > dudeBounds.x + dudeBounds.width) {
                p.x -= dudeBounds.width;
            }
    
            if (p.y < dudeBounds.y) {
                p.y += dudeBounds.height;
            } else if (p.y > dudeBounds.y + dudeBounds.height) {
                p.y -= dudeBounds.height;
            }
            this.tick += 0.1;
        }
    })
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