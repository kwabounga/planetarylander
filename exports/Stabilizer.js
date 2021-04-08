function Stabilizer(params){
    
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,8));
    
    this.anchor.set(1,0)
    this.ticker = PIXI.ticker.shared;
	this.ticker.speed = 0.25;
    this.gotoAndPlay(0);
    // this.textures
    this.visible = false;
    console.log(this);
}
Stabilizer.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

Stabilizer.prototype.getAnimationLoop = function(from,to) {
    
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
// /!\ ne pas créer de function update pour les AnimatedSprite /!\