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

test('DNA.equals compares every gene', () => {
  const {DNA} = loadDNA();
  const dna = new DNA(10, 20, 30, 1, 500);

  assert.equal(dna.equals(new DNA(10, 20, 30, 1, 500)), true);
  assert.equal(dna.equals(new DNA(11, 20, 30, 1, 500)), false);
  assert.equal(dna.equals(new DNA(10, 21, 30, 1, 500)), false);
  assert.equal(dna.equals(new DNA(10, 20, 31, 1, 500)), false);
  assert.equal(dna.equals(new DNA(10, 20, 30, 1.1, 500)), false);
  assert.equal(dna.equals(new DNA(10, 20, 30, 1, 501)), false);
});

test('combine averages genes when mutation does not happen', () => {
  const context = loadDNA();
  const {DNA, combine} = context;
  const child = combine(
      new DNA(10, 20, 30, 1, 200),
      new DNA(20, 40, 50, 2, 800),
  );

  assert.equal(child.size, 15);
  assert.equal(child.move, 30);
  assert.equal(child.dist, 40);
  assert.equal(child.foodAttraction, 1.5);
  assert.equal(child.reproduceAge, 500);
  assert.equal('newSize' in context, false);
  assert.equal('newMove' in context, false);
  assert.equal('newDist' in context, false);
  assert.equal('newFoodAttraction' in context, false);
  assert.equal('newReproduceAge' in context, false);
});

test('default DNA and mutations use the same gene bounds', () => {
  const calls = [];
  const values = [
    10, 1, 50, 0.5, 200,
    0, 12,
    0, 34,
    0, 56,
    0, 0.75,
    0, 300,
  ];
  const {DNA, combine} = loadDNA((min, max) => {
    calls.push([min, max]);
    return values.shift();
  });

  new DNA();
  const child = combine(new DNA(10, 20, 30, 1, 200), new DNA(20, 40, 50, 2, 800));

  assert.deepEqual(calls, [
    [10, 50],
    [1, 100],
    [50, 500],
    [0.5, 1.5],
    [200, 800],
    [undefined, undefined],
    [10, 50],
    [undefined, undefined],
    [1, 100],
    [undefined, undefined],
    [50, 500],
    [undefined, undefined],
    [0.5, 1.5],
    [undefined, undefined],
    [200, 800],
  ]);
  assert.deepEqual(
      {
        size: child.size,
        move: child.move,
        dist: child.dist,
        foodAttraction: child.foodAttraction,
        reproduceAge: child.reproduceAge,
      },
      {size: 12, move: 34, dist: 56, foodAttraction: 0.75, reproduceAge: 300},
  );
});
