var mutation_rate = 0.1;

function DNA(
  size = random(5, 50),
  move = random(1, 10),
  dist = random(50, 500)
) {
  this.size = size;
  this.move = move;
  this.dist = dist;
}

function combine(dna1, dna2) {
  newSize = 0;
  newMove = 0;
  newDist = 0;

  // size combine or mutate
  if (random() < mutation_rate) {
    newSize = random(5, 50);
  } else {
    // average 1 and 2
    newSize = (dna1.size + dna2.size) / 2;
  }

  // move combine or mutate
  if (random() < mutation_rate) {
    newMove = random(5, 50);
  } else {
    // average 1 and 2
    newMove = (dna1.move + dna2.move) / 2;
  }

  // dist combine or mutate
  if (random() < mutation_rate) {
    newDist = random(5, 50);
  } else {
    // average 1 and 2
    newDist = (dna1.dist + dna2.dist) / 2;
  }

  return DNA(newSize, newMove, newDist);
}
