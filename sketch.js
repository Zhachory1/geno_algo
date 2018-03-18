var agents = [];
var pop_size = 5;
var red;
var green;
var debug = true;
var normal_force = 0.01;


function setup() {
	createCanvas(800, 800);
	for (var i = 0; i < pop_size; i++) {
		agents.push(new Agent(random() * width, random() * height, new DNA()));
	}
	red = color(255, 0, 0);
	green = color(0, 255, 0);
}

function draw() {
	background(50);
	for (var i = agents.length - 1; i >= 0; i--) {
		// Add neighbors steering behavior
		for (var j = agents.length - 1; j >= 0; j--) {
			if (j != i) {
				if (dist(agents[i].loc.x,
						agents[i].loc.y,
						agents[j].loc.x,
						agents[j].loc.y) < agents[i].dna.dist) {
					var direction = p5.Vector.sub(agents[j].loc, agents[i].loc);
					var new_force = p5.Vector.mult(direction, agents[i].dna.move);
					agents[i].applyForce(new_force);
				}
			}
		}

		//Add friction
		var friction = p5.Vector.mult(agents[i].velocity, -1);
		agents[i].applyForce(friction.mult(normal_force));

		// Let agent take a step
		agents[i].step();

		// Remove if no health and draw agents.
		if (agents[i].health < 0) {
			agents.splice(i, 1);
		} else {
			agents[i].draw(red, green);
			if (debug) {
				agents[i].drawDebug()
			}
		}
	}
}

function mousePressed() {
	agents.push(new Agent(mouseX, mouseY, new DNA()));
}
