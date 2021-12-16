class Entity {

  // Public field declarations
  speed;
  velocity;
  viewDistance;

  // Private field declarations
  #direction;
  #hitbox;
  #level;

  constructor(x, y, level) {
    const location = new Vector2(x, y);

    // Initalize fields
    this.#hitbox = new Box(location, 8, 8);

    this.velocity = new Vector2(0, 0);
    this.#direction = new Vector2(0, 0);

    this.level = level;
    this.speed = 2;

    // represents max amount of tiles ray can trace to
    this.viewDistance = 50;
  }

  update(delta) {
    this.#checkCollision();

    /*
    If vector's not normalized, diagonal movement is faster than moving
    straight. By normalizing the vector, its values are always between 0 & 1.
    Therefore diagonal movements output {0.71, 0.71} rather than {1, 1}
    */
    this.velocity.normalize();

    // distance                                speed               time
    const x = this.location.x + ((this.velocity.x * this.speed) * delta);
    const y = this.location.y + ((this.velocity.y * this.speed) * delta);
    
    this.location.set(x, y);
  }

  #checkCollision() {
    this.hitbox.cornerPoints.forEach(point => {

      // Math.floor() so the greatest whole number gets returned
      const tileX = Math.floor(point.x);
      const tileY = Math.floor(point.y);

      const tile = this.level.getTile(tileX, tileY);
      
      if (tile === null)
        return;

      if (tile.hasCollision()) {

        // Under most circumstances, should return between -1 and 1
        const diffX = Math.floor(this.location.x) - tileX;
        const diffY = Math.floor(this.location.y) - tileY;
        
        this.velocity.set(diffX, diffY);
      }
    });
  }

  raytrace() {
    const ray = new Vector2(0, 0);

    let tile;

    for (let pixel = 0; pixel < (this.viewDistance * PPM); pixel++) {
      const locX = this.location.x;
      const locY = this.location.y;
      
      // PPM (16) can be replaced with a smaller value at the cost of accuracy
      let pointX = locX + ((pixel / PPM) * this.direction.x);
      let pointY = locY + ((pixel / PPM) * this.direction.y);

      pointX = roundDecimal(pointX, 1);
      pointY = roundDecimal(pointY, 1);

      ray.set(pointX, pointY);

      const tileX = Math.floor(ray.x);
      const tileY = Math.floor(ray.y);

      tile = this.level.getTile(tileX, tileY);

      if (tile === null || tile.type === TileType.AIR) 
        continue;

      return new Ray(this.level, ray);
    }
    return null;
  }

  /**
   * @param {Vector} otherVec - vector this entity should be facing
   */
  lookAt(otherVec) {
    this.#direction = otherVec.clone().subtract(this.location.x, this.location.y).normalize();
  }

  get direction() {
    return this.#direction;
  }

  get hitbox() {
    return this.#hitbox;
  }

  get location() {
    return this.hitbox.location;
  }

  get level() {
    return this.#level;
  }

  /**
   * @param {Level} newLevel - level this entity should spawn in
   */
  set level(newLevel) {

    // Remove entity from previous level if one exists
    if (this.#level !== undefined)
      this.#level.entities.pop(this);
      
    this.#level = newLevel;
    this.#level.entities.push(this);
  }
 
  get rotation() {
    /*
    atan2() is used as a built in way to get theta (radians) with safety checks
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
    */
    const angle = Math.atan2(this.#direction.y, this.#direction.x);
    
    return angle;
  }
}