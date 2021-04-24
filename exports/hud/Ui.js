/**
 * HUD
 */
function Ui() {
  PIXI.Container.call(this);
  this.state = State.getInstance();
  this.fuel = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffffff",
    text: this.state.game.fuel+"/"+this.state.game.fuelMax,
    x: 5,
    y: 5,
  });
  this.speedX = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "vX: 0 m/s",
    x: 5,
    y: 30,
  });
  this.speedY = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "vY: 0 m/s",
    x: 5,
    y: 55,
  });
  this.orientation = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: "0deg",
    x: 5,
    y: 80,
  });
  this.shell = this.createTextField({
    font: "DeadFontWalking",
    fontSize: 20,
    color: "#ffff00",
    text: this.state.game.shell+"%",
    x: 5,
    y: 105,
  });

  // using new display text system
  this.screenInfos = Tools.customText({
    font: "DeadFontWalking",
    fontSize: 40,
    color: "#fffafa",
    text: "Get Ready",
    x: 400,
    y: 40,
  },true);
  this.addChild(this.screenInfos);
}
Ui.prototype = Object.create(PIXI.Container.prototype);

Ui.prototype.createTextField = function (params) {
  let tf = new PIXI.extras.BitmapText(params.text, {
    font: `${params.fontSize}px ${params.font}`,
    tint: Tools.pixiColor(params.color),
  });
  tf.dirty = true;
  this.addChild(tf);
  tf.x = params.x;
  tf.y = params.y;
  return tf;
};


Ui.prototype.updateTextField = function (tf, text, tint = null, centered = false) {
  tf.text = text;
  if(tint && tf._font.tint != tint){
    tf._font.tint  = tint;
  }
  if(centered){
    tf.x = 400 - (tf.width/2)
  }
};

Ui.prototype.update = function () {
  this.updateTextField(
    this.fuel,
    Math.floor(this.state.game.fuel) + "/" + this.state.game.fuelMax,
    Tools.pixiColor((Math.abs(this.state.game.fuel)>= 50)?"#00ff00":"#ff0000")
  );
  this.updateTextField(
    this.speedX,
    "vX: " + Math.floor(this.state.game.speedX * 25) + " m/s",
    getTint((this.state.game.speedX * 25), this.state.game.speedMax)
  );
  this.updateTextField(
    this.speedY,
    "vY: " + Math.floor(this.state.game.speedY * 25) + " m/s",
    getTint((this.state.game.speedY * 25), this.state.game.speedMax)
  );
  
  this.updateTextField(
    this.orientation,
    Math.floor(this.state.game.orientation) + " deg",
    getTint(this.state.game.orientation, 30)
  );
  
  this.updateTextField(
    this.shell,
    (Math.floor(this.state.game.shell) + "%"),
    Tools.pixiColor((Math.abs(this.state.game.shell)>= 50)?"#00ff00":"#ff0000")
  );

  function getTint(val, valMax) {
    let tint = Tools.pixiColor((Math.abs(val)<= valMax)?"#00ff00":"#ff0000")
    return tint
  }
};


