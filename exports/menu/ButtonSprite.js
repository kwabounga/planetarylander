function ButtonSprite(levelID) {
  PIXI.Sprite.call(this,PIXI.Texture.from("ui_button_nb0000"));
  this.state = State.getInstance();

  // this.over = new PIXI.Sprite(PIXI.Texture.from("ui_buttonOver0000"));
  // this.over.anchor.set(0.5);
  
  // this.addChild(this.over);
  this.outed();

  let txt = levelID+"";
  this.text = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 30,
    color: "#fffafa",
    text: txt,
    x: Math.ceil(-((txt.length)*15)/2),
    y: -15,
  })
  this.addChild(this.text);
  this.interactive = true;
  this.buttonMode= true;
}
ButtonSprite.prototype = Object.create(PIXI.Sprite.prototype)


ButtonSprite.prototype.overed = function() {
  this.tint = this.state.menuData.bg[Tools.getHash()].tintOver.replace("#", "0x")
  // this.over.visible = true;
}
ButtonSprite.prototype.outed = function() {
  this.tint = this.state.menuData.bg[Tools.getHash()].tint.replace("#", "0x")
  // this.over.visible = false;
}