function Agent(x, y, size) {
	this.loc = createVector(x, y)
	this.size = size;
	this.health = 100;
	this.velocity = createVector();
	this.acceleration = createVector();
	this.max_velocity = 10;

	this.applyForce = function(force) {
		this.acceleration.add(force.mult(1.0 / this.size));
	}

	this.step = function() {
		// Move agent
		var new_loc = p5.Vector.add(this.loc, this.velocity);
		if (new_loc.x > width - 5 || new_loc.x < 5) {
			this.velocity.x = -this.velocity.x;
		} else if (new_loc.y > height - 5 || new_loc.y < 5) {
			this.velocity.y = -this.velocity.y;
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
		ellipse(0, 0, this.size, this.size / 2);
		pop();
	}
}
