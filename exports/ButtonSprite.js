function ButtonSprite(levelID) {
  PIXI.Sprite.call(this,PIXI.Texture.from("ui_button0000"))
  let txt = levelID+"";
  this.text = this.addText({
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

ButtonSprite.prototype.addText = function(params) {
  let tf = new PIXI.extras.BitmapText(params.text, {
    font: `${params.fontSize}px ${params.font}`,
    tint: params.color.replace("#", "0x"),
  });
  tf.x = params.x;
  tf.y = params.y;
  return tf;
}
