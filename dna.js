var mutation_rate = 0.1;

function DNA(size = random(5, 50), move = random(1, 10), dist = random(
	50, 500)) {
	this.size = size;
	this.move = move;
	this.dist = dist;
}
