/**
 * Create a bonus
 * @class PIXI.Container
 */
function BonusSprite(type, amount){
  PIXI.Container.call(this);

  this.graphic = new PIXI.Sprite(PIXI.Texture.from(`bonus_${type}0000`))
  this.graphic.anchor.set(0.5);
  this.addChild(this.graphic);
  let tAmount = (amount + ""); // cast to string
  this.tfAmount = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 20,
    color: BonusSprite.colorFromType[type],
    text: tAmount,
    x: Math.ceil(-((tAmount.length)*10)/2),
    y: -10,
  });
  this.tfAmount.interactive = true;
  this.tfAmount.buttonMode = true;
  this.addChild(this.tfAmount);
  State.getInstance().log(this);
}
/**
 * proto
 */
BonusSprite.prototype = Object.create(PIXI.Container.prototype)


BonusSprite.colorFromType = {
  fuel:"#f7afaf"
}
