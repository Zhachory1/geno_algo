const mutation_rate = 0.1;
const minSize = 10;
const maxSize = 50;
const minMove = 1;
const maxMove = 100;
const minDist = 50;
const maxDist = 500;
const minFoodAttraction = 0.5;
const maxFoodAttraction = 1.5;

function DNA(
    size = random(minSize, maxSize),
    move = random(minMove, maxMove),
    dist = random(minDist, maxDist),
    foodAttraction = random(minFoodAttraction, maxFoodAttraction),
) {
  this.size = size;
  this.move = move;
  this.dist = dist;
  this.foodAttraction = foodAttraction;

  this.equals = function(other) {
    return (
      this.size == other.size &&
      this.move == other.move &&
      this.dist == other.dist &&
      this.foodAttraction == other.foodAttraction
    );
  };
}

function combine(dna1, dna2) {
  let newSize = 0;
  let newMove = 0;
  let newDist = 0;
  let newFoodAttraction = 0;

  // size combine or mutate
  if (random() < mutation_rate) {
    newSize = random(minSize, maxSize);
  } else {
    // average 1 and 2
    newSize = (dna1.size + dna2.size) / 2;
  }

  // move combine or mutate
  if (random() < mutation_rate) {
    newMove = random(minMove, maxMove);
  } else {
    // average 1 and 2
    newMove = (dna1.move + dna2.move) / 2;
  }

  // dist combine or mutate
  if (random() < mutation_rate) {
    newDist = random(minDist, maxDist);
  } else {
    // average 1 and 2
    newDist = (dna1.dist + dna2.dist) / 2;
  }

  // food attraction combine or mutate
  if (random() < mutation_rate) {
    newFoodAttraction = random(minFoodAttraction, maxFoodAttraction);
  } else {
    // average 1 and 2
    newFoodAttraction = (dna1.foodAttraction + dna2.foodAttraction) / 2;
  }

  return new DNA(newSize, newMove, newDist, newFoodAttraction);
}
