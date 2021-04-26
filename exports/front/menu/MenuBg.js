
/**
 * Create the background of the menu
 * @param {int} world the world Id 
 * @class PIXI.Container
 */
function MenuBg (world) {
  PIXI.Container.call(this)
  this.state = State.getInstance();
  this.sprites = []

  this.displayElements(world);
}
/**
 * proto
 */
MenuBg.prototype = Object.create(PIXI.Container.prototype)

/**
 * create and display background sprites from the state data
 * @param {int} world the world id 
 */
MenuBg.prototype.displayElements = function(world) {
  const me = this
  this.state.menuData.bg[world].sprites.forEach(spriteInfos => {
    let s = new PIXI.Sprite(PIXI.Texture.from(spriteInfos.name))
    s.anchor.set(.5)
    s.position = spriteInfos.position
    if(spriteInfos.tint){
      s.tint = Tools.pixiColor(spriteInfos.tint);
    }
    if(spriteInfos.scale){
      s.scale = spriteInfos.scale;
    }
    if(spriteInfos.filter){
      switch (spriteInfos.filter.type) {
        case 'blur':
          default:
          let f = new PIXI.filters.BlurFilter(spriteInfos.filter.size,3,3);
          f.autoFit = true;
          s.filters = [f];      
          break;
      }
    }
    me.sprites.push(s)
    me.addChild(s)
  });
}


