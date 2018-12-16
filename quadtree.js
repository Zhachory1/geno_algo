var Node = function(points, maxp_p, bl, tr, sw, nw, se, ne, split) {
  this.points = points; // List[p5.Vector]; filled with points in region
  this.bl = bl; // p5.Vector; Bottom left point of the range
  this.tr = tr; // p5.Vector; Top right point of the range
  this.sw = sw; // Node; SW node
  this.nw = nw; // Node; NW node
  this.se = se; // Node; SE node
  this.ne = ne; // Node; NE node
  this.split = split; // Boolean; Whether this is a branching or a leaf node
};

var QuadTree = function(points, max_p, bl, tr) {
  this.max_p = max_p;
  this.bl = bl;
  this.tr = tr;
  this.depth = 0;

  this.build = function(points, bl, tr, depth) {
    if (points.length < this.max_p) {
      // Make leaf!
      return new Node(points, bl, tr, null, null, null, null, false);
    }
    this.depth = max(depth, this.depth);
    // Split points in 4 sub regions
    var new_nodes = this.divide(points, bl, tr);
    var sw = new_nodes.sw;
    var nw = new_nodes.nw;
    var se = new_nodes.se;
    var ne = new_nodes.ne;
    var mid_x = (tr.x + bl.x) / 2;
    var mid_y = (tr.y + bl.y) / 2;
    var nd = depth + 1;
    return new Node(
      [],
      bl,
      tr,
      this.build(sw, bl, createVector(mid_x, mid_y), nd),
      this.build(nw, createVector(bl.x, mid_y), createVector(mid_x, tr.y), nd),
      this.build(se, createVector(mid_x, bl.y), createVector(tr.x, mid_y), nd),
      this.build(ne, createVector(mid_x, mid_y), tr, nd),
      true
    );
  };

  this.divide = function(points, bl, tr) {
    var sw = [];
    var nw = [];
    var se = [];
    var ne = [];
    var mid_x = (tr.x + bl.x) / 2;
    var mid_y = (tr.y + bl.y) / 2;
    for (p of points) {
      if (p.x < mid_x) {
        if (p.y < mid_y) {
          nw.push(p);
        } else {
          sw.push(p);
        }
      } else {
        if (p.y < mid_y) {
          ne.push(p);
        } else {
          se.push(p);
        }
      }
    }
    return { sw: sw, nw: nw, se: se, ne: ne };
  };

  this.insert = function(new_point) {
    var temp_node = this.root;
    var depth = 0;
    while (temp_node.split == true) {
      depth += 1;
      // Is not a leaf, keep traversing
      // Temp gets either nw, ne, se,or sw.
      if (p.x < temp_node.mid_x) {
        if (p.y < temp_node.mid_y) {
          temp_node = temp_node.nw;
        } else {
          temp_node = temp_node.sw;
        }
      } else {
        if (p.y < temp_node.mid_y) {
          temp_node = temp_node.ne;
        } else {
          temp_node = temp_node.se;
        }
      }
    }
    // Now temp is a leaf where my point should reside
    temp_node.points.push(new_point);

    // Check if length passes max_p.
    if (temp_node.points.length > this.max_p) {
      temp_node = this.build(temp_node, temp_node.bl, temp_node.tr, depth);
    }
  };

  this.query = function(needle) {
    var temp_node = this.root;
    var depth = 0;
    while (temp_node.split == true) {
      depth += 1;
      // Is not a leaf, keep traversing
      // Temp gets either nw, ne, se,or sw.
      if (needle.x < temp_node.mid_x) {
        if (needle.y < temp_node.mid_y) {
          temp_node = temp_node.nw;
        } else {
          temp_node = temp_node.sw;
        }
      } else {
        if (needle.y < temp_node.mid_y) {
          temp_node = temp_node.ne;
        } else {
          temp_node = temp_node.se;
        }
      }
    }
    for (p of temp_node.points) {
      if (p.equals(needle)) {
        return true;
      }
    }
    return false;
  };

  // this.

  this.root = this.build(points, bl, tr, 0);
};
