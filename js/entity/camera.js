class Camera extends Entity {

  // Public field declarations
  rotation;

  // Private field declarations
  #width;
  #projectedRays;

  constructor(x, y, level, width) {
    super(x, y, level);

    this.#width = width;

    // use new vector to fix bug where you can't turn around while rendering
    this.rotation = new Vector2(0, -(1));
  }

  // Projects everything camera should see to screen
  project() {
    this.#projectedRays = [];

    const rotX = this.rotation.x;
    const rotY = this.rotation.y;
    const scale = this.#width * 0.9375;

    // rotate to farthest angle camera can see from the left
    this.direction.rotate(-degreeToRad(65 / 2));

    // Represents point on the screen camera should look at 
    const screenVec = this.location.clone().add(this.direction.x, this.direction.y);
  
    // Loop through every pixel on the screen's x axis (width)
    for (let pixel = 0; pixel < this.#width; pixel++) {
      
      // add y to x and vice versa so vector draws horizontal when looking
      // up/down and vertical when looking left/right
      screenVec.add(-rotY / scale, rotX / scale);
      this.lookAt(screenVec);

      const result = this.raytrace();

      // Return if ray failed to hit anything within draw distance
      if (result === null)
        continue;
      this.#projectedRays.push(result);
    }
    // reset normal direction back to center
    this.direction.set(rotX, rotY);
  }

  get projectedRays() {
    return this.#projectedRays;
  }
}