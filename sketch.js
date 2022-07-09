let agents = [];
let foods = [];
let reproduced = 0;
let normalForce = 0.05;

let red;
let green;
let gui;
let options = {
  foodSpawn: 4,
  neighborFlee: 3,
  debug: true,
  pause: false
};

// TODO: Make a kdtree implementation.

function getRate(mult, reducer) {
  return mult / (reducer * reducer);
}

function setUpPopOptions(gui) {
  let popOptions = gui.addFolder("Population Options")
  popOptions.add(options, "foodSpawn", 0, 10, 0.5);
  popOptions.add(options, "neighborFlee", 0, 10, 0.5);
  popOptions.add(options, "debug");
  popOptions.add(options, "pause");
}

/* eslint-disable-next-line no-unused-vars */
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  for (let i = 0; i < 20; i++) {
    agents.push(new Agent(random() * width, random() * height, new DNA()));
    for (let j = 0; j < 3; j++) {
        let newFood = createVector(random() * width, random() * height);
        foods.push(newFood);
    }
    }

  red = color(255, 0, 0);
  green = color(0, 255, 0);
  gui = new dat.GUI();
  setUpPopOptions(gui);
  setUpAgentOptions(gui);
}

/* eslint-disable-next-line no-unused-vars */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function todoidalDist(locA, locB) {
  let dx = abs(locB.x - locA.x)
  let dy = abs(locB.y - locA.y)
  if (dx > (0.5*width)) dx = width - dx
  if (dy > (0.5*height)) dy = height - dy

  return sqrt(dx*dx + dy*dy)
}

/* eslint-disable-next-line no-unused-vars */
function draw() {
  background(50);
  // This getRate makes the rate relative to the size of the current population.
  let neighborMoveRate = getRate(options.neighborFlee, agents.length);
  let foodRandomRate = getRate(options.foodSpawn, agents.length);

  // Let's add some food and agents randomly in the environment
  if (!options.pause && (random() < foodRandomRate)) {
    let newFood = createVector(random() * width, random() * height);
    foods.push(newFood);
  }

  for (let i = agents.length - 1; i >= 0; i--) {
    // Add neighbors steering behavior
    for (let j = agents.length - 1; j >= 0; j--) {
      if (j != i) {
        let dist = todoidalDist(agents[i].loc, agents[j].loc)

        if (agents[i].ready_to_reproduce && 
            agents[j].ready_to_reproduce && 
            (dist < max(agents[i].dna.dist, agents[j].dna.dist))) {
          agents[i].reproduce();
          agents[j].reproduce();
          let newDNA = combine(agents[i].dna, agents[j].dna);
          agents.push(new Agent(agents[i].loc.x, agents[i].loc.y, newDNA));
          reproduced++
        }
        if (dist < agents[i].dna.dist) {
          let direction = p5.Vector.sub(agents[j].loc, agents[i].loc).normalize();
          // If the other is bigger than you, run away
          let away = 2 * log(agents[i].dna.size / agents[j].dna.size);
          let newForce = p5.Vector.mult(
            direction,
            away * agents[i].dna.move * neighborMoveRate
          );
          agents[i].applyForce(newForce);
        }
      }
    }

    let averageDir = createVector()
    for (let j = foods.length - 1; j >= 0; j--) {
      let dist = todoidalDist(agents[i].loc, foods[j])
      if (dist < agents[i].dna.size) {
        foods.splice(j, 1);
        agents[i].heal();
      } else if (dist < agents[i].dna.dist) {
        averageDir.add(new p5.Vector.sub(foods[j], agents[i].loc))
        // break;
      }
    }
    let newForce = p5.Vector.mult(averageDir.normalize(), agents[i].dna.move/10);
    agents[i].applyForce(newForce);

    //Add friction
    let friction = p5.Vector.mult(agents[i].velocity, -1);
    agents[i].applyForce(friction.mult(normalForce));

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
  for (let food of foods) {
    fill(green.r, green.g, green.b);
    ellipse(food.x, food.y, 8, 8);
  }

  for (let i = agents.length - 1; i >= 0; i--) {
    // Remove if no health and draw agents.
    agents[i].draw(red, green);
    if (options.debug) {
      agents[i].drawDebug();
    }
  }

//   noLoop()
}

/* eslint-disable-next-line no-unused-vars */
function mousePressed() {
  agents.push(new Agent(mouseX, mouseY, new DNA()));
}

/* eslint-disable-next-line no-unused-vars */
function keyPressed() {
  if (keyCode == ENTER) {
    options.pause = !options.pause;
    console.log("No loop");
    noLoop();
  }
}
