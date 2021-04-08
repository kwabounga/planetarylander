function Reactor(params){
    
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,14),true);
    
    this.anchor.set(0.5,0);
    this.gotoAndPlay(0);
    this.visible = false;

}
Reactor.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

Reactor.prototype.getAnimationLoop = function(from,to) {
    
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        // console.log(textures);
        return textures;
}
// /!\ ne pas créer de function update pour les AnimatedSprite /!\
