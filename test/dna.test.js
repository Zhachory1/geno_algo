const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadDNA(random = () => 0.5) {
  const context = {random};
  vm.createContext(context);
  vm.runInContext(
      fs.readFileSync(path.join(__dirname, '..', 'dna.js'), 'utf8'),
      context,
  );
  return context;
}

test('DNA.equals compares move', () => {
  const {DNA} = loadDNA();
  const dna = new DNA(10, 20, 30, 1, 500);

  assert.equal(dna.equals(new DNA(10, 20, 30, 1, 500)), true);
  assert.equal(dna.equals(new DNA(10, 21, 30, 1, 500)), false);
});

test('combine averages genes when mutation does not happen', () => {
  const {DNA, combine} = loadDNA();
  const child = combine(
      new DNA(10, 20, 30, 1, 200),
      new DNA(20, 40, 50, 2, 800),
  );

  assert.equal(child.size, 15);
  assert.equal(child.move, 30);
  assert.equal(child.dist, 40);
  assert.equal(child.foodAttraction, 1.5);
  assert.equal(child.reproduceAge, 500);
});
