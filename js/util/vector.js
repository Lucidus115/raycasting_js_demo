// Vector 2D class with x and y fields

class Vector2 {

  // Public field declarations
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  subtract(x, y) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  multiply(x, y) {
    this.x *= x;
    this.y *= y;
    return this;
  }

  divide(x, y) {
    this.x /= x;
    this.y /= y;
    return this;
  }

  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  distance(otherVec) {
    const x2 = Math.pow(otherVec.x - this.x, 2);
    const y2 = Math.pow(otherVec.y - this.y, 2);

    return Math.sqrt(x2 + y2);
  }

  dotProduct(otherVec) {
    return (this.x * otherVec.x) + (this.y * otherVec.y);
  }

  length() {
    const x2 = Math.pow(this.x, 2);
    const y2 = Math.pow(this.y, 2);

    return Math.sqrt(x2 + y2);
  }

  // Convert to unit vector. Values will always be between -1 and 1
  normalize() {
    
    // Assign length var so we don't constantly call length() function
    const length = this.length();
    
    // We can't divide by 0 so return
    if (length === 0)
      return this;

    this.x /= length;
    this.y /= length;
    
    return this;
  }

  // Couldn't remember how to rotate a vector. Here's the formula:
  // https://en.wikipedia.org/wiki/Rotation_matrix
  rotate(angle) {
    const rotX = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
    const rotY = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
    this.set(rotX, rotY);
  }

  /*
   Usually used when we want to perform operations like add or normalize
   but don't want to overwrite the original value
   */
  clone() {
    return new Vector2(this.x, this.y);
  }
}