/**
 * Create the Reactor
 * @param {object} params the lander params 
 * @class PIXI.extras.AnimatedSprite
 */
function Reactor(params){
    this.params = params;
    PIXI.extras.AnimatedSprite.call(this, this.getAnimationLoop(1,14),true);
    
    this.anchor.set(0.5,0);
    this.gotoAndPlay(0);
    this.visible = false;

}
/**
 * proto
 */
Reactor.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);

/**
 * mini texture  Factory for reactor animation
 * @param {int} from the starting animation key frame id
 * @param {int} to the ending animation key frame id 
 * @returns an array of textures for this animation
 */
Reactor.prototype.getAnimationLoop = function(from,to) {
    const textures = [];
        for(let i = from; i <= to; i ++){
            const texture = PIXI.Texture.from(`${this.params.sprite}${String(i-1).padStart(4,"0")}`);
            textures.push(texture);
        }
        return textures;
}
// /!\ ne pas créer de function update pour les AnimatedSprite /!\
