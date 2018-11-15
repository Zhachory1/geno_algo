var agents = [];
var foods = [];
var pop_size = 20;
var normal_force = 0.05;
var debug = true;
var is_step = true;

var red;
var green;
var debug_button;
var is_step_button;
var food_random_slider;
var neighbor_move_slider;

// TODO: Make a kdtree implementation.

// TODO: Make agent/food creation rate relative to number of agents in the
//       environment.

function setup() {
  createCanvas(800, 800);
  for (var i = 0; i < pop_size; i++) {
    agents.push(new Agent(random() * width, random() * height, new DNA()));
  }
  red = color(255, 0, 0);
  green = color(0, 255, 0);
  food_random_slider = createSlider(0, 0.2, 0.1, 0.002);
  neighbor_move_slider = createSlider(0, 0.5, 0.2, 0.005);
  debug_button = createButton("Debug");
  is_step_button = createButton("Pause");
  debug_button.mousePressed(toggleDebug);
  is_step_button.mousePressed(toggleIsStep);
}

function toggleDebug() {
  debug = !debug;
}

function toggleIsStep() {
  is_step = !is_step;
}

function draw() {
  background(50);
  var neighbor_move_rate = neighbor_move_slider.value();
  var food_random_rate = food_random_slider.value();

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
    if (is_step) {
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
    if (debug) {
      agents[i].drawDebug();
    }
  }
}

function mousePressed() {
  agents.push(new Agent(mouseX, mouseY, new DNA()));
}

function keyPressed() {
  if (keyCode == ENTER) {
    is_step = !is_step;
  }
}
