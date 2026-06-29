const mutation_rate = 0.1;

function DNA(
    size = random(10, 50),
    move = random(1, 100),
    dist = random(50, 500),
    foodAttraction = random(0.5, 1.5),
    reproduceAge = random(200, 800),
) {
  this.size = size;
  this.move = move;
  this.dist = dist;
  this.foodAttraction = foodAttraction;
  this.reproduceAge = reproduceAge;

  this.equals = function(other) {
    return (
      this.size == other.size &&
      this.move == other.move &&
      this.dist == other.dist &&
      this.foodAttraction == other.foodAttraction &&
      this.reproduceAge == other.reproduceAge
    );
  };
}

function combine(dna1, dna2) {
  let newSize = 0;
  let newMove = 0;
  let newDist = 0;
  let newFoodAttraction = 0;
  let newReproduceAge = 0;

  // size combine or mutate
  if (random() < mutation_rate) {
    newSize = random(5, 50);
  } else {
    // average 1 and 2
    newSize = (dna1.size + dna2.size) / 2;
  }

  // move combine or mutate
  if (random() < mutation_rate) {
    newMove = random(1, 100);
  } else {
    // average 1 and 2
    newMove = (dna1.move + dna2.move) / 2;
  }

  // dist combine or mutate
  if (random() < mutation_rate) {
    newDist = random(50, 500);
  } else {
    // average 1 and 2
    newDist = (dna1.dist + dna2.dist) / 2;
  }

  // food attraction combine or mutate
  if (random() < mutation_rate) {
    newFoodAttraction = random(0.5, 1.5);
  } else {
    // average 1 and 2
    newFoodAttraction = (dna1.foodAttraction + dna2.foodAttraction) / 2;
  }

  // reproduce age combine or mutate
  if (random() < mutation_rate) {
    newReproduceAge = random(200, 800);
  } else {
    // average 1 and 2
    newReproduceAge = (dna1.reproduceAge + dna2.reproduceAge) / 2;
  }

  return new DNA(
      newSize,
      newMove,
      newDist,
      newFoodAttraction,
      newReproduceAge,
  );
}
