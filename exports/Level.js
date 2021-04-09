function Level(params){
    this.params = params;
    PIXI.Container.call(this);

    this.state = State.getInstance();

    this.lander;
    this.terrain;
    this.landZones = [];
    this.stars = [];
    this.bonus = [];
    this.malus = [];
    
}

Level.prototype = Object.create(PIXI.Container.prototype);

Level.prototype.update = function(){

}