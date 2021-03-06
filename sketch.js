var agents = [];
var foods = [];
var pop_size = 20;
var normal_force = 0.05;
var debug = true;
var is_step = true;

var red;
var green;
var gui;
var options = {
  food_spawn: 2,
  neighbor_flee: 1,
  debug: true,
  pause: false

};

// TODO: Make a kdtree implementation.

function getRate(x, base) {
  return 5 / ((x + base) * (x + base));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  for (var i = 0; i < pop_size; i++) {
    agents.push(new Agent(random() * width, random() * height, new DNA()));
  }
  red = color(255, 0, 0);
  green = color(0, 255, 0);
  gui = new dat.GUI({name: "Population Options"});
  gui.add(options, "food_spawn", 0, 10, 1);
  gui.add(options, "neighbor_flee", 0, 10, 1);
  gui.add(options, "debug");
  gui.add(options, "pause");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(50);
  // This getRate makes the rate relative to the size of the current population.
  var neighbor_move_rate = getRate(agents.length, options.neighbor_flee);
  var food_random_rate = getRate(agents.length, options.food_spawn);

  // Let's add some food and agents randomly in the environment
  if (is_step && random() < food_random_rate) {
    var newFood = createVector(random() * width, random() * height);
    foods.push(newFood);
  }

  for (var i = agents.length - 1; i >= 0; i--) {
    // Add neighbors steering behavior
    for (var j = agents.length - 1; j >= 0; j--) {
      if (j != i) {
        var dist =
          (abs(agents[i].loc.x - agents[j].loc.x) +
            abs(agents[i].loc.y - agents[j].loc.y)) /
          2;
        if (agents[i].ready_to_reproduce && agents[j].ready_to_reproduce) {
          agents[i].reproduce();
          agents[j].reproduce();
          var newDNA = combine(agents[i].dna, agents[j].dna);
          agents.push(new Agent(agents[i].loc.x, agents[i].loc.y, new DNA()));
          console.log("REPRODUCED");
        }
        if (dist < agents[i].dna.dist) {
          var direction = p5.Vector.sub(agents[j].loc, agents[i].loc);
          // If the other is bigger than you, run away
          var away = 1;
          if (agents[j].dna.size > agents[i].dna.size) {
            away = -1;
          }
          var new_force = p5.Vector.mult(
            direction,
            away * agents[i].dna.move * neighbor_move_rate
          );
          agents[i].applyForce(new_force);
        }
      }
    }

    for (var j = foods.length - 1; j >= 0; j--) {
      var dist =
        abs(agents[i].loc.x - foods[j].x) + abs(agents[i].loc.y - foods[j].y);
      if (dist < agents[i].dna.size) {
        foods.splice(j, 1);
        agents[i].heal();
      } else if (dist < agents[i].dna.dist) {
        var direction = p5.Vector.sub(foods[j], agents[i].loc);
        var new_force = p5.Vector.mult(direction, agents[i].dna.move);
        agents[i].applyForce(new_force);
        break;
      }
    }

    //Add friction
    var friction = p5.Vector.mult(agents[i].velocity, -1);
    agents[i].applyForce(friction.mult(normal_force));

    // Let agent take a step
    if (!options.pause) {
      agents[i].step();
    }

    if (agents[i].health < 0) {
      foods.push(createVector(agents[i].loc.x, agents[i].loc.y));
      agents.splice(i, 1);
    }
  }

  // Draw the shit
  for (var food of foods) {
    fill(green.r, green.g, green.b);
    ellipse(food.x, food.y, 8, 8);
  }

  for (var i = agents.length - 1; i >= 0; i--) {
    // Remove if no health and draw agents.
    agents[i].draw(red, green);
    if (options.debug) {
      agents[i].drawDebug();
    }
  }
}

function mousePressed() {
  agents.push(new Agent(mouseX, mouseY, new DNA()));
}

function keyPressed() {
  if (keyCode == ENTER) {
    options.pause = !options.pause;
    Controller.updateDisplay()
  }
}
