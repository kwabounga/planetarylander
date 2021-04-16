function MenuBg (world) {
  PIXI.Container.call(this)
  this.state = State.getInstance();
  this.sprites = []

  this.displayElements(world);
}
MenuBg.prototype = Object.create(PIXI.Container.prototype)
MenuBg.prototype.displayElements = function(world) {
  const me = this
  this.state.menuData.bg[world].sprites.forEach(spriteInfos => {
    let s = new PIXI.Sprite(PIXI.Texture.from(spriteInfos.name))
    s.anchor.set(.5)
    s.position = spriteInfos.position
    if(spriteInfos.tint){
      s.tint = spriteInfos.tint.replace('#','0x');
    }
    if(spriteInfos.scale){
      s.scale = spriteInfos.scale;
    }
    if(spriteInfos.filter){
      switch (spriteInfos.filter.type) {
        case 'blur':
          default:
          let f = new PIXI.filters.BlurFilter(spriteInfos.filter.size,3,3);
          // f.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
          f.autoFit = true;
          s.filters = [f];      
          break;
      }
    }
    me.sprites.push(s)
    me.addChild(s)
  });
}


