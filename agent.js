let agentOptions = { 
  healing_rate: 20,
  poison_rate: 10,
  hurt_rate: 0.2,
  reproduce_thres: 500
}

function setUpAgentOptions(gui) {
  let agent_options = gui.addFolder("Agent Options")
  agent_options.add(agentOptions, "healing_rate", 0, 20, 0.5)
  agent_options.add(agentOptions, "poison_rate", 0, 20, 0.5)
  agent_options.add(agentOptions, "hurt_rate", 0, 1, 0.1)
  agent_options.add(agentOptions, "reproduce_thres")
}

function Agent(x, y, dna) {
  this.loc = createVector(x, y);
  this.health = 100;
  this.velocity = createVector();
  this.acceleration = createVector();
  this.dna = dna;
  // Make max_velocity relative to size
  // Size is from 10 -> 50. Want speed to be from 5 -> 10;
  this.max_velocity = (this.dna.size - 10) / 8 + 5;
  this.life = 0;
  this.ready_to_reproduce = false;

  this.applyForce = function(force) {
    this.acceleration.add(force.mult(1.0 / this.dna.size));
  };

  this.step = function() {
    this.life++;
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_velocity);
    this.acceleration.mult(0);

    // Move agent
    var new_loc = p5.Vector.add(this.loc, this.velocity);
    if (new_loc.x > width) {
      new_loc.x = new_loc.x - width;
    } else if (new_loc.x < 0) {
      new_loc.x = new_loc.x + width;
    }
    if (new_loc.y > height) {
      new_loc.y = new_loc.y - height;
    } else if (new_loc.y < 0) {
      new_loc.y = new_loc.y + height;
    }
    this.loc = new_loc;

    if (!this.ready_to_reproduce && this.life >= agentOptions.reproduce_thres) {
      this.ready_to_reproduce = true;
    }

    // Take away health
    this.health -= agentOptions.hurt_rate;
  };

  this.reproduce = function() {
    this.ready_to_reproduce = false;
    this.life = 0;
    this.health -= agentOptions.poison_rate;
  };

  this.heal = function() {
    this.health += agentOptions.healing_rate;
  };

  // TODO: Draw agent as a fish
  this.draw = function(bot, top) {
    push();
    var current = lerpColor(bot, top, this.health / 100);
    noStroke();
    fill(current);
    translate(this.loc.x, this.loc.y);
    rotate(this.velocity.heading() - PI);
    ellipse(0, 0, this.dna.size, this.dna.size / 2);
    var first = createVector(this.dna.size * 0.4, 0); // Connect triangle to circle
    var secnd = createVector(this.dna.size * 0.6, -this.dna.size / 4); // left of fin
    var third = createVector(this.dna.size * 0.6, this.dna.size / 4); // right of fin
    triangle(first.x, first.y, secnd.x, secnd.y, third.x, third.y);
    pop();
  };

  this.drawDebug = function() {
    push();
    noFill();
    translate(this.loc.x, this.loc.y);
    stroke(255);
    ellipse(0, 0, this.dna.dist, this.dna.dist);
    pop();
  };

  this.equals = function(other) {
    return this.dna == other.dna;
  };
}
