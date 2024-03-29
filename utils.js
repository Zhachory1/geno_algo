// Warn if overriding existing method
if (Array.prototype.equals) {
  console.warn(
      'Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there\'s a framework conflict or you\'ve got double inclusions in your code.',
  );
}
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (let i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

function randFloor(x) {
  // Gaussion between 0 and 1
  const randG = min(1, max(0, randomGaussian(0.5, 0.2)));
  return randG * x;
}

Array.prototype.extend = function(other_array) {
  /* You should include a test to check whether other_array really is an array */
  other_array.forEach(function(v) {
    this.push(v);
  }, this);
};
