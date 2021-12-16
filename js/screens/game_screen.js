class GameScreen extends Screen {

  // Private field declarations
  #fps;

  // Game related fields
  #level;
  #cam;
  #player;
  
  constructor() {
    super();
    
    this.canvas.style.cursor = 'none';
    this.#initGame();
  }

  #initGame() {
    this.#level = new Level();

    this.#cam = new Camera(21.5, 21.5, this.#level, canvas.width);
    this.#player = new Player(21.5, 21.5, this.#level);

    // Input 
    const input = new GameInput(this.#cam, this.#player);

    /*
    Could not access any field of a class inside of events without
    calling bind(this). Solution was found here:
    https://stackoverflow.com/questions/53835331/javascript-es6-classes-method-cant-access-class-property-defined-inside-class
    */
    window.addEventListener("keydown", input.keyDown.bind(input));
    window.addEventListener("keyup", input.keyUp.bind(input));

    window.addEventListener("mousemove", input.mouseMove.bind(input));
  }

  // Processing
  update(delta) {

    // Calculate approximate frames per second
    this.#fps = 1.0 / delta;
  
    // Make camera follow player at all times
    this.#cam.location.set(this.#player.location.x, this.#player.location.y);

    // Could go inside input, but I want this logic controlled by the game
    this.#player.direction.set(this.#cam.rotation.x, this.#cam.rotation.y);

    this.#level.entities.forEach(entity => {
      entity.update(delta);
    });

    this.#cam.project();
  }
  
  // Output
  render() {
    const ctx = canvas.getContext("2d"); 
    const midHeight = canvas.height / 2;

    // Erase everything drawn in the previous frame to prevent smearing effect
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let pixel = 0; pixel < this.#cam.projectedRays.length; pixel++) {
      const result = this.#cam.projectedRays[pixel];
      
      const scale = 3;
      // Further away wall is, the smaller it'll be drawn 
      const wallHeight = (canvas.height / (this.#cam.location.distance(result.hitPoint) * PPM)) * scale;
      const tileColor = result.hitTile.getColor();

      if (result.hitTileFace === TileFace.WEST ||
        result.hitTileFace === TileFace.EAST) {
        tileColor["r"] -= 50;
        tileColor["g"] -= 50;
        tileColor["b"] -= 50;
      } 

      // draw walls
      ctx.beginPath();

      ctx.strokeStyle = this.#getColor(tileColor);

      // start drawing where top of wall is
      ctx.moveTo(pixel, (midHeight - wallHeight));

      // draw line to the bottom of the wall
      ctx.lineTo(pixel, (midHeight + wallHeight));
      ctx.stroke();

      // draw ceiling
      ctx.beginPath();
      ctx.strokeStyle = "#0055CC"
      ctx.moveTo(pixel, midHeight - wallHeight);
      ctx.lineTo(pixel, 0);
      ctx.stroke();

      //draw floor
      ctx.beginPath();
      ctx.strokeStyle = "#009933"
      ctx.moveTo(pixel, midHeight + wallHeight);
      ctx.lineTo(pixel, canvas.height);
      ctx.stroke();
    }

    if (this.#player.show2D) {
      for (let x = 0; x < this.#level.mapSizeX; x++)
        for (let y = 0; y < this.#level.mapSizeY; y++) {
          let tile = this.#level.getTile(x, y);
  
          if (tile.type === TileType.AIR)
            continue;
            
          ctx.fillStyle = this.#getColor(tile.getColor());
          ctx.fillRect(x * PPM, y * PPM, 16, 16);
        }
  
      /*
      Entity render logic here instead of calling entity.render() because they
      shouldn't need to know how to render themselves. Single Responsiblity 
      Principle.
      */
      this.#level.entities.forEach(entity => {
  
        ctx.fillStyle = "#FF00FF";
  
        // Convert world coords to screen coords.
        const screenX = entity.location.x * PPM;
        const screenY = entity.location.y * PPM;
  
        /*
        Couldn't figure out how to properly rotate a specific object in JavaScript.
        I found and learned the solution here:
        https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
        */
        ctx.translate(screenX, screenY);
        ctx.rotate(entity.rotation);
        ctx.translate(-screenX, -screenY);
      
        /*
        By subtracting by half of the entities size, entity.location can refer 
        to the middle of the sprite rather than the top left corner.
        */
        ctx.fillRect(screenX - (entity.hitbox.width / 2), 
        screenY - (entity.hitbox.height / 2), entity.hitbox.width, 
        entity.hitbox.height);
  
        //Set transform to default values and stop rotation from persisting.
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      // Draw Field of View cone
      for (let pixel = 0; pixel < this.#cam.projectedRays.length; pixel++) {
        const result = this.#cam.projectedRays[pixel];

        ctx.strokeStyle = "#FFFFFF";
        
        const camX = this.#cam.location.x * PPM;
        const camY = this.#cam.location.y * PPM;
      
        ctx.beginPath();
        ctx.moveTo(camX, camY);
        ctx.lineTo(result.hitPoint.x * PPM, result.hitPoint.y * PPM);
        ctx.stroke();
      }
    }

    // Call last so HUD displays at the top
    this.#drawHUD(ctx);
  }

  #drawHUD(ctx) {
    ctx.font = "16px verduna";
    ctx.fillStyle = "#FFFFFF";

    const midWidth = canvas.width / 2;
    const midHeight = canvas.height / 2;

    const fps = Math.round(this.#fps);
    const locX = roundDecimal(this.#player.location.x, 2);
    const locY = roundDecimal(this.#player.location.y, 2);
    const velX = roundDecimal(this.#player.velocity.x, 2);
    const velY = roundDecimal(this.#player.velocity.y, 2);

    // Crosshair
    ctx.fillRect(midWidth, midHeight, 6, 6);

    // Debug text
    ctx.fillText("FPS: " + fps, 0, 16);
    ctx.fillText("Location X: " + locX + " Y: " + locY, 0, 32);
    ctx.fillText("Velocity: " + velX + " " + velY, 0, 48);    
  }

  #getColor(tileColor) {
    return "rgb(" + tileColor["r"] + ", " + tileColor["g"] + ", " + tileColor["b"] + ")";
  }
}