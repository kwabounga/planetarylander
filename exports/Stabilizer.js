function Stabilizer(params){
    
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,14));
    this.loop = true;
    this.gotoAndPlay(1);
    this.anchor.set(1,0)
}
Stabilizer.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

Stabilizer.prototype.getAnimationLoop = function(from,to) {
    this.loop = true;
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
Stabilizer.prototype.update = function(){

}