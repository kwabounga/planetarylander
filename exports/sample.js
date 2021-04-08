//Create engine - All the game stuff
var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Composites = Matter.Composites,
Common = Matter.Common,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body;

// create an engine
var engine = Engine.create(),
world = engine.world;

// create a renderer
var render = Render.create({
canvas: document.getElementById("canv"),
engine: engine,
options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: '#6DDA4A'
}
});
engine.world.gravity.y = 0;
Render.run(render);
// create runner
var runner = Runner.create();
Runner.run(runner, engine);
    
var car = Bodies.rectangle(100, 100, 50, 80, {
friction: 0.1,
frictionAir: 0.08,
restitution: 0,
rot: 0,
render: {
fillStyle: "#FF0000",
    /*sprite: {
        //You can use this to apply a background image to the car
        texture: "Path/To/Image.png",
        xScale: number,
        yScale: number
    }/**/
}
});
 var block = Bodies.rectangle(350, 100, 100, 400, {
  isStatic: true,
    friction: 1,
  inertia: Infinity,
    frictionAir: 0.1,
 restitution: 0,
    rot: 0,
    render: {
        fillStyle: "#0000FF",
    }
  });
  World.add(world, [car, block]);
    
    
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var carX = 0;
var carY = 0;

window.addEventListener("keydown", function(e) {
if(e.keyCode == 39) {
rightPressed = true;
}
else if(e.keyCode == 37) {
leftPressed = true;
}
else if(e.keyCode == 38) {
upPressed = true;
}
else if(e.keyCode == 40) {
downPressed = true;
}
});
window.addEventListener("keyup", function(e) {
if(e.keyCode == 39) {
rightPressed = false;
}
else if(e.keyCode == 37) {
leftPressed = false;
}
else if(e.keyCode == 38) {
upPressed = false;
}
else if(e.keyCode == 40) {
downPressed = false;
}
});
    
function updateCar() {
//Declare variables for velocity

var speed = 5;
var carRot = car.rot*180/Math.PI;
var velY = speed * Math.cos(carRot * Math.PI / 180);
var velX = speed * Math.sin(carRot * Math.PI / 180)*-1;	
var pushRot = 0;
//Update variables

if (upPressed==false&&downPressed==false) {
    velY = 0;
    velX = 0;
}
else {
    //alert(carX+", "+carY);
}
if (downPressed == true) {
    velY *= -1;
    velX *= -1;
}
if (leftPressed) {
    pushRot = -0.1;
}
if (rightPressed) {
    pushRot = 0.1;
}
car.rot += pushRot;


//Set position of car
carX += velX;
carY += velY;
Body.applyForce(car, {x:carX,y:carY}, {x:velX/200,y:velY/200});
Body.setAngle(car, car.rot);
requestAnimationFrame(updateCar);
}
window.requestAnimationFrame(updateCar);