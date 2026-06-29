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
  pause: false,
  resetPopulation: resetPopulation
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
  popOptions.add(options, "resetPopulation");
}

function resetPopulation() {
  agents = [];
  foods = [];
  reproduced = 0;
  for (let i = 0; i < 20; i++) {
    agents.push(new Agent(random() * width, random() * height, new DNA()));
    for (let j = 0; j < 3; j++) {
        let newFood = createVector(random() * width, random() * height);
        foods.push(newFood);
    }
    }
}

/* eslint-disable-next-line no-unused-vars */
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  resetPopulation();

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

function axisRanges(center, radius, maxValue) {
  if (radius * 2 >= maxValue) return [[0, maxValue]];

  const minValue = center - radius;
  const maxRangeValue = center + radius;
  if (minValue < 0) return [[0, maxRangeValue], [maxValue + minValue, maxValue]];
  if (maxRangeValue > maxValue) return [[minValue, maxValue], [0, maxRangeValue - maxValue]];
  return [[minValue, maxRangeValue]];
}

function queryWrapped(tree, loc, radius) {
  const results = [];
  const seen = new Set();
  const xRanges = axisRanges(loc.x, radius, width);
  const yRanges = axisRanges(loc.y, radius, height);

  for (let xRange of xRanges) {
    for (let yRange of yRanges) {
      for (let value of tree.queryRange(
          [xRange[0], yRange[0]],
          [xRange[1], yRange[1]],
      )) {
        if (!seen.has(value)) {
          seen.add(value);
          results.push(value);
        }
      }
    }
  }
  return results;
}

function drawHud() {
  const best = agents.reduce(
      (currentBest, agent) => !currentBest || agent.life > currentBest.life ?
        agent : currentBest,
      undefined,
  );
  const bestDNA = best ?
    `size ${best.dna.size.toFixed(1)}, move ${best.dna.move.toFixed(1)}, ` +
      `dist ${best.dna.dist.toFixed(1)}, ` +
      `food ${best.dna.foodAttraction.toFixed(1)}, ` +
      `age ${best.dna.reproduceAge.toFixed(0)}` :
    'none';

  fill(255);
  noStroke();
  textSize(14);
  text(`Population: ${agents.length}`, 10, 20);
  text(`Food: ${foods.length}`, 10, 40);
  text(`Reproduced: ${reproduced}`, 10, 60);
  text(`Best DNA by life: ${bestDNA}`, 10, 80);
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

  const foodTree = kdFromList(foods, [0, 0], [width, height], (food) => [
    food.x,
    food.y,
  ]);
  const agentTree = kdFromList(agents, [0, 0], [width, height], (agent) => [
    agent.loc.x,
    agent.loc.y,
  ]);
  const maxAgentDist = agents.reduce(
      (largest, agent) => max(largest, agent.dna.dist),
      0,
  );

  for (let i = agents.length - 1; i >= 0; i--) {
    // Add neighbors steering behavior
    const agentRadius = max(agents[i].dna.dist, maxAgentDist);
    const candidateAgents = queryWrapped(agentTree, agents[i].loc, agentRadius);
    for (let j = candidateAgents.length - 1; j >= 0; j--) {
      const other = candidateAgents[j];
      if (agents.indexOf(other) == -1 || other == agents[i]) continue;

      let dist = todoidalDist(agents[i].loc, other.loc)

      if (agents[i].ready_to_reproduce &&
          other.ready_to_reproduce &&
          (dist < max(agents[i].dna.dist, other.dna.dist))) {
        agents[i].reproduce();
        other.reproduce();
        let newDNA = combine(agents[i].dna, other.dna);
        agents.push(new Agent(agents[i].loc.x, agents[i].loc.y, newDNA));
        reproduced++
      }
      if (dist < agents[i].dna.dist) {
        let direction = p5.Vector.sub(other.loc, agents[i].loc).normalize();
        // If the other is bigger than you, run away
        let away = 2 * log(agents[i].dna.size / other.dna.size);
        let newForce = p5.Vector.mult(
          direction,
          away * agents[i].dna.move * neighborMoveRate
        );
        agents[i].applyForce(newForce);
      }
    }

    let averageDir = createVector()
    const candidateFoods = queryWrapped(foodTree, agents[i].loc, agents[i].dna.dist);
    for (let j = candidateFoods.length - 1; j >= 0; j--) {
      const food = candidateFoods[j];
      const foodIndex = foods.indexOf(food);
      if (foodIndex == -1) continue;

      let dist = todoidalDist(agents[i].loc, food)
      if (dist < agents[i].dna.size) {
        foods.splice(foodIndex, 1);
        agents[i].heal();
      } else if (dist < agents[i].dna.dist) {
        averageDir.add(new p5.Vector.sub(food, agents[i].loc))
        // break;
      }
    }
    let newForce = p5.Vector.mult(
        averageDir.normalize(),
        agents[i].dna.move * agents[i].dna.foodAttraction / 10,
    );
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

  drawHud();

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
  }
}
