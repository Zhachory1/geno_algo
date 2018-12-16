var points;
var num_of_points = 30;
var kd;

function setup() {
  createCanvas(600, 600);
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
}

function draw() {
  background(50);
  // print point
  fill(255, 255, 255);
  for (point of points) {
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
  var mid = node.point;
  var next_split = (split + 1) % 2;
  stroke(255, 255, 255, 100);
  console.log(min, mid, max);
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
