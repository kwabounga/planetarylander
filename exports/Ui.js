function Ui(data) {
  PIXI.Container.call(this);
  this.state = State.getInstance();
  this.fuel = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffffff",
    text: "500/500",
    x: 5,
    y: 5,
  });
  this.speedX = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "vX: 25 m/s",
    x: 5,
    y: 30,
  });
  this.speedY = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "vY: 25 m/s",
    x: 5,
    y: 55,
  });
}
Ui.prototype = Object.create(PIXI.Container.prototype);

Ui.prototype.createTextField = function (params) {
  let tf = new PIXI.extras.BitmapText(params.text, {
    font: `${params.fontSize}px ${params.font}`,
    tint: params.color.replace("#", "0x"),
  });
  this.addChild(tf);
  tf.x = params.x;
  tf.y = params.y;
  return tf;
};


Ui.prototype.updateTextField = function (tf, text) {
  tf.text = text;
};

Ui.prototype.update = function () {
  this.updateTextField(
    this.fuel,
    Math.floor(this.state.game.fuelCurrent) + "/" + this.state.game.fuelMax
  );
  this.updateTextField(
    this.speedX,
    "vX: " + Math.floor(this.state.game.speedX * 25) + " m/s"
  );
  this.updateTextField(
    this.speedY,
    "vY: " + Math.floor(this.state.game.speedY * 25) + " m/s"
  );
};
