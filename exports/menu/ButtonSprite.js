/**
 * Create a button to display in the menu
 * @param {int} levelID the level id
 * @class PIXI.Sprite
 */
function ButtonSprite(levelID) {
  PIXI.Sprite.call(this,PIXI.Texture.from("ui_button_nb0000"));
  this.state = State.getInstance();

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
/**
 * proto
 */
ButtonSprite.prototype = Object.create(PIXI.Sprite.prototype)

/**
 * mouseover button state
 */
ButtonSprite.prototype.overed = function() {
  this.tint = Tools.pixiColor(this.state.menuData.bg[Tools.getHash()].tintOver)
}
/**
 * mouseout button state
 */
ButtonSprite.prototype.outed = function() {
  this.tint = Tools.pixiColor(this.state.menuData.bg[Tools.getHash()].tint)
}