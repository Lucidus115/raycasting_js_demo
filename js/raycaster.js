/*
  This program takes a top-down 2D world and renders it as a pseduo-3D first
  person world.

  Program written by: Evan Ripczinski
*/

// Pixel-Per-Meter
const PPM = 16;

class Engine {

  // Public field declarations
  screen;

  // Private field declarations
  #prevTime;

  constructor() {

    /*
    Returns a more precise floating point value of the time, unaffected if user
    changes their system's clock.
    https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
    */
    this.#prevTime = performance.now();
  }

  /*
  Game loop so program runs at a consistent speed no matter the proccessing
  speed of a user's CPU.
  */
  tick() {
    let currentTime = performance.now();

    // Time between the current and last frame
    let delta = (currentTime - this.#prevTime) / 1000;

    if (this.screen !== undefined) {
      this.screen.update(delta);
      this.screen.render();
    }

    this.#prevTime = currentTime;
    requestAnimationFrame(this.tick.bind(this));
  }
}

function main() {

  // Creates the heart of the program
  const engine = new Engine();

  engine.screen = new GameScreen();
  engine.tick();
}

// Call main function and run program
main();