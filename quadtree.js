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
  this.root = this._build(points, max_p, bl, tr);

  this._build = function(points, max_p, bl, tr, depth) {
    if (points.length < this.max_p) {
      // Make leaf!
      return Node(points, bl, tr, null, null, null, null, false);
    }
    this.depth = max(depth, this.depth);
    // Split points in 4 sub regions
    var new_nodes = this._divide(points, bl, tr);
    var sw = new_nodes.sw;
    var nw = new_nodes.nw;
    var se = new_nodes.se;
    var ne = new_nodes.ne;
    var nd = depth + 1;
    return Node(
      [],
      bl,
      tr,
      this._build(sw, bl, createVector(mid_x, mid_y), nd),
      this._build(nw, createVector(bl.x, mid_y), createVector(mid_x, tr.y), nd),
      this._build(se, createVector(mid_x, bl.y), createVector(tr.x, mid_y), nd),
      this._build(ne, createVector(mid_x, mid_y), tr, nd),
      true
    );

    this._divide = function(points, bl, tr) {
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
  };

  // this.insert = function(new_point) {
  //   var temp_node = this.root;
  //   while temp_node.split == true {
  //
  //   }
  // };
};
