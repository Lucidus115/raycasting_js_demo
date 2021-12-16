class Ray {
  
  // Private field declarations
  #level
  #hitPoint

  constructor(level, hitPoint) {
    this.#level = level;
    this.#hitPoint = hitPoint;
  }

  get hitPoint() {
    return this.#hitPoint;
  }

  get hitTile() {
    const x = Math.floor(this.hitPoint.x);
    const y = Math.floor(this.hitPoint.y);

    return this.#level.getTile(x, y);
  }

  //FIXME: Get corners to return correct face
  get hitTileFace() {
    if (this.hitTile === null) {
      return;
    }

    const pointX = this.hitPoint.x;
    const pointY = this.hitPoint.y;
    const tileX = this.hitTile.location.x;
    const tileY = this.hitTile.location.y;

    if (pointX === tileX) {
      return TileFace.WEST;
    }

    if (pointX === tileX + 0.9) {
      return TileFace.EAST;
    }

    if (pointY === tileY) {
      return TileFace.NORTH;
    }

    if (pointY === tileY + 0.9) {
      return TileFace.SOUTH;
    }

  }
}