var points;
var num_of_points = 1000;
var kd;
var quad;

function setup() {
  createCanvas(1000, 1000);
  points = [];
  for (var i = 0; i < num_of_points; i++) {
    points.push(createVector(randFloor(width), randFloor(height)));
  }
  // points = [createVector(50, 80), createVector(25, 60), createVector(75, 20)];
  kd = kdFromList(
    points,
    createVector(0, height),
    createVector(width, 0),
    function(obj) {
      var aray = obj.array();
      return [aray[0], aray[1]];
    }
  );
  quad = new QuadTree(
    points,
    1,
    createVector(0, height),
    createVector(width, 0)
  );
}

function draw() {
  background(50);
  // print point
  fill(255, 255, 255);
  for (point of points) {
    ellipse(point.x, point.y, 8);
  }
  rectMode(CORNERS);
  noFill();
  stroke(255, 255, 255, 100);
  printQuad(quad.root);

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
  var mid = node.point;
  var next_split = (split + 1) % 2;
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
        next_split
      );
    }
    if (node.right !== undefined) {
      printKD(
        node.right,
        createVector(mid[split], min[next_split])
          .array()
          .slice(0, 2),
        max,
        next_split
      );
    }
  } else {
    //Horizontal lines, top and bottom
    line(min[next_split], mid[split], max[next_split], mid[split]);
    if (node.left !== undefined) {
      printKD(
        node.left,
        createVector(min[next_split], mid[split])
          .array()
          .slice(0, 2),
        max,
        next_split
      );
    }
    if (node.right !== undefined) {
      printKD(
        node.right,
        min,
        createVector(max[next_split], mid[split])
          .array()
          .slice(0, 2),
        next_split
      );
    }
  }
}

function printQuad(node) {
  console.log(node.bl.x, node.bl.y, node.tr.x, node.tr.y);
  rect(node.bl.x, node.bl.y, node.tr.x, node.tr.y);
  if (node.split) {
    for (sect of [node.nw, node.sw, node.ne, node.se]) {
      printQuad(sect);
    }
  }
}
