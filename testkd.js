let points;
const num_of_points = 500;
let kd;
let quad;

function setup() {
  createCanvas(1000, 1000);
  points = [];
  for (let i = 0; i < num_of_points; i++) {
    points.push(createVector(randFloor(width), randFloor(height)));
  }
  // points = [createVector(50, 80), createVector(25, 60), createVector(75, 20)];
  kd = kdFromList(
      points,
      createVector(0, height),
      createVector(width, 0),
      function(obj) {
        const aray = obj.array();
        return [aray[0], aray[1]];
      },
  );
  quad = new QuadTree(
      points,
      1,
      createVector(0, height),
      createVector(width, 0),
  );
}

function draw() {
  background(50);
  // print point
  fill(255, 255, 255);
  for (point of points) {
    ellipse(point.x, point.y, 6);
  }
  rectMode(CORNERS);
  noFill();
  stroke(255, 255, 255, 100);
  printQuad(quad.root);

  const bl = createVector(random(0, width), random(0, height));
  const tr = createVector(random(bl.x, width), random(0, bl.y));

  stroke(0, 255, 100, 200);
  rect(bl.x, bl.y, tr.x, tr.y);

  fill(0, 255, 100);
  found = quad.queryRange(bl, tr);
  for (point of found) {
    ellipse(point.x, point.y, 8);
  }
  // printKD(
  //   kd.node,
  //   kd.botleft.array().slice(0, 2),
  //   kd.toprght.array().slice(0, 2),
  //   0
  // );
  noLoop();
}

// Assuming this is a 2d environment
function printKD(node, min, max, split) {
  const mid = node.point;
  const next_split = (split + 1) % 2;
  if (split == 0) {
    // Vertical lines, left/right
    line(mid[split], min[next_split], mid[split], max[next_split]);
    if (node.left !== undefined) {
      printKD(
          node.left,
          min,
          createVector(mid[split], max[next_split])
              .array()
              .slice(0, 2),
          next_split,
      );
    }
    if (node.right !== undefined) {
      printKD(
          node.right,
          createVector(mid[split], min[next_split])
              .array()
              .slice(0, 2),
          max,
          next_split,
      );
    }
  } else {
    // Horizontal lines, top and bottom
    line(min[next_split], mid[split], max[next_split], mid[split]);
    if (node.left !== undefined) {
      printKD(
          node.left,
          createVector(min[next_split], mid[split])
              .array()
              .slice(0, 2),
          max,
          next_split,
      );
    }
    if (node.right !== undefined) {
      printKD(
          node.right,
          min,
          createVector(max[next_split], mid[split])
              .array()
              .slice(0, 2),
          next_split,
      );
    }
  }
}

function printQuad(node) {
  rect(node.bl.x, node.bl.y, node.tr.x, node.tr.y);
  if (node.split) {
    for (sect of [node.nw, node.sw, node.ne, node.se]) {
      printQuad(sect);
    }
  }
}
