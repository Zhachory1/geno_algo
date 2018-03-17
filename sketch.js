var agents = [];
var pop_size = 20;
var gravity;
var red;
var green;

function setup() {
	createCanvas(800, 800);
	for (var i = 0; i < pop_size; i++) {
		agents.push(new Agent(random() * width, random() * height, random(5, 50)));
	}
	gravity = createVector(0, 0.01);
	red = color(255, 0, 0);
	green = color(0, 255, 0);
}

function draw() {
	background(50);
	for (var i = agents.length - 1; i >= 0; i--) {
		agents[i].applyForce(p5.Vector.mult(gravity, agents[i].size));
		agents[i].applyForce(p5.Vector.random2D());
		agents[i].step();
		if (agents[i].health < 0) {
			agents.splice(i, 1);
		} else {
			agents[i].draw(red, green);
		}
	}
}

function mousePressed() {
	agents.push(new Agent(mouseX, mouseY, random(5, 50)));
}
