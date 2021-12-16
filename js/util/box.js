class Box {

  // Public field declarations
  location;

  // Private field declarations
  #width;
  #height;

  constructor(location, width, height) {

    // Initalize fields
    this.location = location;
    this.#width = width;
    this.#height = height;
  }

  // Returns each corner of this box as a set of coordinates
  get cornerPoints() {

    // this.location refers to middle so get difference and offset to corners
    const widthDiff = (this.width / 2) / PPM;
    const heightDiff = (this.height / 2) / PPM;

    // Corner points of hitbox
      const bottomRight = this.location.clone().add(widthDiff, heightDiff);
      const bottomLeft = this.location.clone().add(-widthDiff, heightDiff);
      const topLeft = this.location.clone().add(-widthDiff, -heightDiff);
      const topRight = this.location.clone().add(widthDiff, -heightDiff);

    return [bottomRight, bottomLeft, topLeft, topRight];
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }
}