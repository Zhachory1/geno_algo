const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadKDTree() {
  const context = {floor: Math.floor};
  vm.createContext(context);
  vm.runInContext(
      fs.readFileSync(path.join(__dirname, '..', 'kdtree.js'), 'utf8'),
      context,
  );
  return context;
}

function byId(values) {
  return Array.from(values, (value) => value.id).sort();
}

test('queryRange returns boundary and duplicate points', () => {
  const {kdFromList} = loadKDTree();
  const points = [
    {id: 'a', x: 0, y: 0},
    {id: 'b', x: 5, y: 5},
    {id: 'c', x: 5, y: 5},
    {id: 'd', x: 9, y: 9},
  ];

  const tree = kdFromList(points, [0, 0], [10, 10], (p) => [p.x, p.y]);

  assert.deepEqual(byId(tree.queryRange([0, 0], [5, 5])), ['a', 'b', 'c']);
});

test('queryRange handles empty trees', () => {
  const {kdFromList} = loadKDTree();
  const tree = kdFromList([], [0, 0], [10, 10], (p) => [p.x, p.y]);

  assert.deepEqual(Array.from(tree.queryRange([0, 0], [10, 10])), []);
});
