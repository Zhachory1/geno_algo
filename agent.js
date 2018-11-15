var healing_rate = 20;
var poison_rate = 10;
var hurt_rate = 0.1;
var reproduce_thres = 300;

function Agent(x, y, dna) {
  this.loc = createVector(x, y);
  this.health = 100;
  this.velocity = createVector();
  this.acceleration = createVector();
  this.max_velocity = 10;
  this.dna = dna;
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
      new_loc.x = 0;
    } else if (new_loc.x < 0) {
      new_loc.x = width;
    }
    if (new_loc.y > height) {
      new_loc.y = 0;
    } else if (new_loc.y < 0) {
      new_loc.y = height;
    }
    this.loc = new_loc;

    if (!this.ready_to_reproduce && this.life == reproduce_thres) {
      this.ready_to_reproduce = true;
    }

    // Take away health
    this.health -= hurt_rate;
  };

  this.reproduce = function() {
    this.ready_to_reproduce = false;
    this.life = 0;
    this.health -= poison_rate;
  };

  this.heal = function() {
    this.health += healing_rate;
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
}
