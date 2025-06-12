// Define grid size
let grid  = 20;
// Define canva width
let wide = 34 * grid;
// Define canvas height (the same as the width)
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

  // Set the Angle mode to degrees
  angleMode(DEGREES);

  // Convert yellow to RGB value
  yellowRgbColor = color(246, 230, 75);

  // Initialize the position of the food
  let accent = [colour.R, colour.B, colour.G];
  // Add food on the vertical line
  vLines.forEach((c) => {
    crossingPosX.push(c * grid + 10);
    for (let y = 10; y < height; y += grid) {
      foods.push({ x: c * grid + 10, y: y, c: random(accent), deadTime: 0 });
    }
  });
  // Add food on the horizontal line
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
  
  // Draw grid lines
  fill(colour.Y);
  vLines.forEach(c => rect(c * grid, 0, grid, height)); // vertical line
  hLines.forEach(r => rect(0, r * grid, wide, grid)); // horizontal line

  // Move Pac-Man
  if (checkNextPos(pacman.ang, { x: pacman.x, y: pacman.y }, pacman.speed)) {
    if (pacman.ang == 270) {
      pacman.y = pacman.y - pacman.speed; // up
    } else if (pacman.ang == 0) {
      pacman.x = pacman.x + pacman.speed; // right
    } else if (pacman.ang == 90) {
      pacman.y = pacman.y + pacman.speed; // down
    } else if (pacman.ang == 180) {
      pacman.x = pacman.x - pacman.speed; // left
    }
  } else {
    // If can't move forward, change direction
    if (pacman.ang == 270) {
      pacman.ang = 90;
    } else if (pacman.ang == 0) {
      pacman.ang = 180;
    } else if (pacman.ang == 90) {
      pacman.ang = 270;
    } else if (pacman.ang == 180) {
      pacman.ang = 0;
    }
  }

  // Draw foods
  foods.forEach(f => {
    if (f.deadTime == 0) {
      fill(f.c);
      noStroke();
      ellipse(f.x, f.y, 4, 4); // Foods
    }

    // Detect whether Pac-Man has eaten food
    if (dist(f.x, f.y, pacman.x, pacman.y) < 10) {
      f.deadTime = millis(); // Record the time when it was eaten
      pacman.c = f.c; // Change the color of Pac-Man
    }
    // The food reappeared ten seconds later
    if (f.deadTime > 0 && millis() - f.deadTime > 10000) {
      f.deadTime = 0;
    }
  });

  // Draw Pac-Man
  drawPacMan(pacman.x, pacman.y, pacman.c, pacman.ang);

  // If Pac-Man is at the intersection and the area around is passable, change direction randomly
  if (checkAllAround({ x: pacman.x, y: pacman.y }, pacman.speed)) {
    pacman.ang = random([0, 90, 180, 270]);
  }

  blocks.forEach(b => {
    fill(b.colour);
    rect(b.col * grid, b.row * grid, b.w * grid, b.h * grid);
  });
}

// Draw colored rectangles on the grid line
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

// Pac-Man function
function drawPacMan(x, y, c, ang) {
  push();
  translate(x, y);
  rotate(ang);
  fill(c);
  // Calculate the opening and closing Angle of the mouth
  let timeInSeconds = frameCount / 60;
  let mouthAngle = map(sin(timeInSeconds * 360), -1, 1, 10, 40);
  // Draw the shape of Pac-Man
  arc(0, 0, grid - 2, grid - 2, mouthAngle, 360 - mouthAngle);
  pop();
}

// Check whether Pac-Man is passable all around
function checkAllAround(pos, speed) {
  // Obtain the colors in four directions
  let col1 = get(pos.x, pos.y - grid / 2 - speed); // up
  let col2 = get(pos.x + grid / 2 + speed, pos.y); // right
  let col3 = get(pos.x, pos.y + grid / 2 + speed); // down
  let col4 = get(pos.x - grid / 2 - speed, pos.y); // left

  // Check if it is at the intersection
  const condition1 = crossingPosX.includes(pos.x);
  const condition2 = crossingPosY.includes(pos.y);
  // Check whether all four directions are yellow (passable)
  const condition3 = compareColor(col1, yellowRgbColor);
  const condition4 = compareColor(col2, yellowRgbColor);
  const condition5 = compareColor(col3, yellowRgbColor);
  const condition6 = compareColor(col4, yellowRgbColor);

  return condition1 && condition2 && condition3 && condition4 && condition5 && condition6;
}

// Check whether the next position is passable
function checkNextPos(ang, pos, speed) {
  if (ang == 270) {
    // up
    let col = get(pos.x, pos.y - grid / 2 - speed);
    return compareColor(col, yellowRgbColor);
  } else if (ang == 0) {
    // right
    let col = get(pos.x + grid / 2 + speed, pos.y);
    return compareColor(col, yellowRgbColor);
  } else if (ang == 90) {
    // down
    let col = get(pos.x, pos.y + grid / 2 + speed);
    return compareColor(col, yellowRgbColor);
  } else if (ang == 180) {
    // left
    let col = get(pos.x - grid / 2 - speed, pos.y);
    return compareColor(col, yellowRgbColor);
  }
}

// Compare whether the two colors are the same
function compareColor(col, col2) {
  return (
    red(col) == red(col2) &&
    green(col) == green(col2) &&
    blue(col) == blue(col2)
  );
}