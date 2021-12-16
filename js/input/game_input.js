class GameInput {

  // Private field declarations
  #cam;
  #player;

  #lastMouseMove;
  #sensitivity;

  constructor(cam, player) {
    this.#cam = cam;
    this.#player = player;

    this.#lastMouseMove = 0;
    this.#sensitivity = 0.02;
  }

  keyDown(event) {
    switch(event.code) {
      case "KeyW":
        this.#player.isMovingUp = true;
        break;
      case "KeyS":
        this.#player.isMovingDown = true;
        break;
      case "KeyA":
        this.#player.isMovingLeft = true;
        break;
      case "KeyD":
        this.#player.isMovingRight = true;
        break;
      case "KeyE":
        let multipler;

        // Fixes bug where movement gets stuck after leaving prompt if held down
        this.#player.isMovingUp = false;
        this.#player.isMovingDown = false;
        this.#player.isMovingLeft = false;
        this.#player.isMovingRight = false;
        
        do {
          multipler = Number(prompt("Enter a value between 1 & 10"));

          if (multipler === 0)
            return;
        } while (multipler < 1 || multipler > 10);
          
        this.#sensitivity = 0.01;
        this.#sensitivity *= multipler;
        break;
      case "KeyF":
        this.#player.show2D = true;
        break;
    } 
  }
      
  keyUp(event) {
    switch(event.code) {
      case "KeyW":
        this.#player.isMovingUp = false;
        break;
      case "KeyS":
        this.#player.isMovingDown = false;
        break;
      case "KeyA":
        this.#player.isMovingLeft = false;
        break;
      case "KeyD":
        this.#player.isMovingRight = false;
        break;
      case "KeyF":
        this.#player.show2D = false;
        break;
    } 
  }

  /* 
  Event.movement returns either a positive or negative value, depending on
  if mouse moved left, right, up, or down from the previous mouse position.
  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  */
  mouseMove(event) {
    let angle;

    if (event.movementX >= 1) {
      angle = this.#sensitivity;
    } else if (event.movementX <= -1) {
      angle = -this.#sensitivity;

    // If mouse hits the edge of screen this condition will likely trigger
    } else {
      angle = this.#lastMouseMove;
    }
 
    this.#cam.rotation.rotate(angle);

    this.#cam.rotation.normalize();
    this.#cam.direction.set(this.#cam.rotation.x, this.#cam.rotation.y);

    this.#lastMouseMove = angle;
  }
}