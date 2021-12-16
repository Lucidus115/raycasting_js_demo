class Player extends Entity {

  // Public field declarations
  isMovingUp = false;
  isMovingDown = false;
  isMovingLeft = false;
  isMovingRight = false;

  show2D = false;
  
  constructor(x, y, level) {
    super(x, y, level);
  }

  update(delta) {
    const dir = this.direction;

    // Reset velocity from last frame
    this.velocity.set(0, 0);

    // Poll input. Check all conditions so movement doesn't stick
    // Multiple keys can be pressed at once so don't use if else
    if (this.isMovingUp)
      this.velocity.add(dir.x, dir.y);
    if (this.isMovingDown)
      this.velocity.add(-dir.x, -dir.y);
    if (this.isMovingLeft)
      this.velocity.add(dir.y, -dir.x);
    if (this.isMovingRight)
      this.velocity.add(-dir.y, dir.x);

    super.update(delta);
  }
}