// Canvas grid configuration
let grid  = 20;
let wide = 34 * grid;
let height = wide;

// Colour palette
let colour = {
  W : '#ffffff', // white
  Y : '#f6e64b', // yellow
  R : '#b33025', //red
  B : '#2d59b5', //blue
  G : '#d8d8d8', //grey
};
let yellowRgbColor;

// Grid line positions
let vLines = [1, 3, 7, 12, 21, 29, 32];
let hLines = [1, 5, 11, 13, 16, 19, 27, 32];

// Block definitions
let blocks = [
  {col: 1, row:  4, w: 1, h: 1, colour: colour.G},
  {col: 1, row: 10, w: 3, h: 3, colour: colour.R},
  {col: 1, row: 26, w: 3, h: 3, colour: colour.R},
  {col: 5, row: 22, w: 1, h: 1, colour: colour.G},
  
  {col: 9, row:  1, w: 1, h: 1, colour: colour.G},
  {col: 10, row:  4, w: 1, h: 1, colour: colour.R},
  {col: 11, row:  7, w: 3, h: 6, colour: colour.B},
  {col: 11, row:  9, w: 1, h: 2, colour: colour.R},
  {col: 11, row: 15, w: 1, h: 1, colour: colour.G},
  
  {col: 11, row: 22, w: 3, h: 3, colour: colour.R},
  {col: 11, row: 28, w: 1, h: 1, colour: colour.G},
  {col: 15, row: 28, w: 1, h: 1, colour: colour.B},
];

// Pac-Man Object with position, angle, speed, and color
let pacman = { x: 100, y: 30, ang: 0, speed: 1, c: colour.R };
// Crossing point positions used to control random direction
let crossingPosX = [];
let crossingPosY = [];
// Food pellets array
let foods = []

function setup() {
  createCanvas(wide, height);
  angleMode(DEGREES);  // Important for Pac-Man rotation later

  yellowRgbColor = color(246, 230, 75); // Used to detect grid walls

  let accent = [colour.R, colour.B, colour.G];

  vLines.forEach((c) => {
    crossingPosX.push(c * grid + 10);
    for (let y = 10; y < height; y += grid) {
      foods.push({ x: c * grid + 10, y: y, c: random(accent), deadTime: 0 });
    }
  });

  hLines.forEach((r) => {
    crossingPosY.push(r * grid + 10);
    for (let x = 10; x < wide; x += grid) {
      foods.push({ x: x, y: r * grid + 10, c: random(accent), deadTime: 0 });
    }
  });
}

function draw() {
  background(colour.W);
  noStroke();
  
  // Draw yellow grid lines
  fill(colour.Y);
  vLines.forEach(c => rect(c * grid, 0, grid, height));
  hLines.forEach(r => rect(0, r * grid, wide, grid));

  // Render and handle food pellets
  foods.forEach(f => {
    if (f.deadTime == 0) {
      fill(f.c);
      noStroke();
      ellipse(f.x, f.y, 4, 4); // Draw foods as small dot
    }
    
    // Detect collision between pacman and food
    if (dist(f.x, f.y, pacman.x, pacman.y) < 10) {
      f.deadTime = millis(); // Mark as eaten
      pacman.c = f.c; // Pac-Man changes to food color
    }

    // Respawn food after 5 seconds
    if (f.deadTime > 0 && millis() - f.deadTime > 5000) {
      f.deadTime = 0;
    }
  });

  // Draw Blocks
  blocks.forEach(b => {
    fill(b.colour);
    rect(b.col * grid, b.row * grid, b.w * grid, b.h * grid);
  });
}

function colourDashesOnLines() {
  let accent = [colour.Y, colour.R, colour.B, colour.G];

  vLines.forEach((c, idx) => {
    for (let r = 0; r < height/grid; r++) {
      if (random() < 0.33) {
        fill(accent[(r + idx) % accent.length]);
        rect(c * grid, r * grid, grid, grid);
      }
    }
  });
  
  hLines.forEach((r, idx) => {
    for (let c = 0; c < wide/grid; c++) {
      if (random() < 0.33) {
        fill(accent[(c + idx + 2) % accent.length]);
        rect(c * grid, r * grid, grid, grid);
      }
    }
  });
}