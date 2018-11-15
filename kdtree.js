var Node = function(point, split, value, left, right) {
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
    this.value = undefined
    this.left = undefined;
    this.right = undefined;
  }

  this.setLeft = function(left) {
    this.left = left;
  }

  this.setRight = function(right) {
    this.right = right;
  }

  this.setAll = function(point, split, value) {
    this.point = point;
    this.split = split;
    this.value = value;
  }
}

var queryRange = function(min_point, max_point) {
  this.min = min_point; // bottom left corner of rectangle query
  this.max = max_point; // top right corner of rectangle query
}

var KDTree = function(node, botleft, toprght) {
  this.node = node;
  this.botleft = botleft;
  this.toprght = toprght;
}

// Function to take a list of agents and return a KD-tree of them
function kdFromAgents(agents, botleft, toprght) {
  // Create a recursive algorithm to put points in kdtree for me.
  var makeKd = function(agent_set, split) {
    // Take the current sub set of agents and split
    if (agent_set.length == 0) {
      // Base case, stops the recursion
      return undefined;
    }

    // Else, sort the set by split dimension
    var sorted = agent_set.sort(compareWithParam(split));
    var m = sorted.length / 2; // Median index
    var d = sorted[m]; // Median value
    var values = [d];
    // gather all the same points with that value in this dimension
    for ((m+1 < sorted.length) && (sorted[m+1].loc.array()[split] == d[split])) {
      values.push(sorted[m+1])
      m++;
    }
    var nextSplit = (split + 1) % d.length;
    return new Node()
  }
}

function compareWithParam(split) {
  return function(obj1, obj2) {
    if (split == 0) {
      return obj1.loc.x - obj2.loc.x;
    } else {
      return obj1.loc.y - obj2.loc.y;
    }
  }
}
