class Tile {
  
  // Public field declarations
  location;
  type;

  constructor(x, y, type) {
    this.location = new Vector2(x, y);
    this.type = type;
  }

  hasCollision() {
    switch(this.type) {
      case TileType.AIR:
        return false
    }
    return true;
  }

  getColor() {
    switch(this.type) {
      case TileType.AIR:
        return null;
      case TileType.WHITE:
        return {"r": 255, "g": 255, "b": 255};
      case TileType.RED:
        return {"r": 255, "g": 0, "b": 0};
      default:
        return {"r": 0, "g": 0, "b": 0};
    }
  }
}

// Enum-like classes for readability purposes
class TileFace {
  static NORTH = 0;
  static SOUTH = 1;
  static WEST = 2;
  static EAST = 3;
}

class TileType {
  static AIR = 0;
  static WHITE = 1;
  static RED = 2;
}