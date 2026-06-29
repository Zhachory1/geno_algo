# geno_algo

Browser visualization of a small genetic algorithm. Fish-like agents move around a p5.js canvas, eat food, lose health, reproduce, and pass mutated DNA to children.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Controls

- **Enter**: pause/resume the simulation
- **Mouse click**: add a new random agent at the cursor
- **Population Options > resetPopulation**: reset agents, food, and reproduction count
- **Population Options > debug**: show/hide perception ranges

## Development

```bash
npm install
npm test
npm run lint
```

`npm run lint` currently reports existing style debt; `npm test` runs deterministic smoke tests for DNA and KDTree behavior.

## Main files

- `index.html`: main simulation page
- `sketch.js`: p5 setup, draw loop, controls, HUD, spatial lookup
- `agent.js`: agent movement, health, reproduction readiness, drawing
- `dna.js`: inherited and mutated DNA fields
- `kdtree.js`: KDTree build/query logic
- `quadtree.js`: experimental QuadTree logic
- `examples/kdtree.html`: manual spatial-index visualization

## Backlog

Tracked in GitHub issues #1-#12.
