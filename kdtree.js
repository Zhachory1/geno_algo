const Node = function(point, split, value, left, right) {
  this.point = point; // k-dim list to define the location of the point.
  this.split = split; // current dim splitting data by. 0 <= split < k
  // Actual object(s) associated with the point. This could be a list as
  // multiple objects might be on the same plane.
  this.value = value;
  this.left = left; // Left subtree node
  this.right = right; // Right subtree node

  this.clearTree = function() {
    delete this.left;
    delete this.right;
    delete this.value;
    this.point = [];
    this.split = 0;
    this.value = undefined;
    this.left = undefined;
    this.right = undefined;
  };

  this.setAll = function(point, split, value, left, right) {
    this.point = point;
    this.split = split;
    this.value = value;
    this.left = left;
    this.right = right;
  };
};

const queryRange = function(min_point, max_point) {
  this.min = min_point; // bottom left corner of rectangle query
  this.max = max_point; // top right corner of rectangle query
};

const KDTree = function(node, botleft, toprght, func) {
  this.node = node;
  this.botleft = botleft;
  this.toprght = toprght;
  this.func = func;

  this.insert = function(x) {
    var insertImpl = function(new_x, curr_node, split) {
      if (!curr_node) {
        curr_node = new Node(
            this.func(new_x),
            split,
            [new_x],
            undefined,
            undefined,
        );
        return;
      }
      const x_point = this.func(new_x);
      const dim = x_point.length;
      if (x_point.equals(curr_node.point)) {
        // Duplicate, add to values.
        cure_node.push(new_x);
      } else if (x_point[split] < curr_node.point[split]) {
        curr_node.left = insertImpl(new_x, curr_node.left, (split + 1) % dim);
      } else {
        curr_node.right = insertImpl(new_x, curr_node.right, (split + 1) % dim);
      }
      return curr_node;
    };
    this.node = insertImpl(x, this.node, 0);
  };
};

// Function to take a list of agents and return a KD-tree of them
function kdFromList(list, botleft, toprght, func) {
  // Create a recursive algorithm to put points in kdtree for me.
  // The func is a function that turns the value into an array that represents
  // the location of the value.
  var makeKd = function(sublist, split, func) {
    // Take the current sub set of agents and split
    if (sublist.length == 0) {
      // Base case, stops the recursion
      return undefined;
    }

    // Else, sort the set by split dimension
    const sorted = sublist.sort(compareWithParam(func, split));
    let m = floor(sorted.length / 2); // Median index
    const d = sorted[m]; // Median value
    const values = [];
    values.push(d);
    // gather all the same points with that value in this dimension
    const n = 0;
    while (
      m + n + 1 < sorted.length &&
      func(sorted[m + n + 1])[split] == func(d)[split]
    ) {
      values.push(sorted[m + n + 1]);
      m++;
    }
    const nextSplit = (split + 1) % func(d).length;

    return new Node(
        func(d),
        split,
        d,
        makeKd(sublist.slice(0, m), nextSplit, func),
        makeKd(sublist.slice(m + n + 1, sublist.length), nextSplit, func),
    );
  };
  return new KDTree(makeKd(list, 0, func), botleft, toprght, func);
}

function compareWithParam(func, split) {
  return function(obj1, obj2) {
    return func(obj1)[split] - func(obj2)[split];
  };
}
