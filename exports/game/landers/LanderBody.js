function LanderBody (params) {
    this.box;
  // create the box for lander
if(params.vertices){
    this.box = Matter.Bodies.fromVertices(
      params.x,
      params.y,
      params.vertices,
      {
        rot: 0,

        density: params.density,
        frictionAir: params.frictionAir,
        friction: params.friction,
        restitution: params.restitution,
        render: {
          fillStyle: '#f19648',
          strokeStyle: '#f19648',
          lineWidth: 1
      }
      }, false
    );
} else{
    this.box = Matter.Bodies.rectangle(
      params.x,
      params.y,
      params.width,
      params.height,
      {
        rot: 0,

        density: params.density,
        frictionAir: params.frictionAir,
        friction: params.friction,
        restitution: params.restitution,
      }
    );    
}

  return this.box;
}