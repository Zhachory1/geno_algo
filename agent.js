function Agent(x, y, dna) {
	this.loc = createVector(x, y)
	this.health = 100;
	this.velocity = createVector();
	this.acceleration = createVector();
	this.max_velocity = 10;
	this.dna = dna;

	this.applyForce = function(force) {
		this.acceleration.add(force.mult(1.0 / this.dna.size));
	}

	this.step = function() {
		// Move agent
		var new_loc = p5.Vector.add(this.loc, this.velocity);
		if (new_loc.x > width) {
			new_loc.x = 0;
		} else if (new_loc.x < 0) {
			new_loc.x = width;
		}
		if (new_loc.y > height) {
			new_loc.y = 0;
		} else if (new_loc.y < 0) {
			new_loc.y = height;
		}
		this.velocity.add(this.acceleration);
		this.loc = new_loc;
		this.velocity.limit(this.max_velocity);
		this.acceleration.mult(0);

		// Take away health
		this.health -= 0.1;
	}

	this.draw = function(bot, top) {
		push();
		var current = lerpColor(bot, top, this.health / 100)
		noStroke();
		fill(current);
		translate(this.loc.x, this.loc.y);
		rotate(this.velocity.heading());
		ellipse(0, 0, this.dna.size, this.dna.size / 2);
		pop();
	}

	this.drawDebug = function() {
		push();
		noFill();
		translate(this.loc.x, this.loc.y);
		stroke(255);
		ellipse(0, 0, this.dna.dist, this.dna.dist);
		pop();
	}
}
