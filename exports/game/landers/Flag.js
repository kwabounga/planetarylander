function Flag(params){
    
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,35),true);
    this.anchor.set(0,1)
    this.ticker = PIXI.ticker.shared;
	this.ticker.speed = 0.25;
    this.gotoAndPlay(0);
}
Flag.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

Flag.prototype.getAnimationLoop = function(from,to) {
    
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
// /!\ don't create update function for AnimatedSprite  it will overwrite the original /!\
