let cam;
let mic;
let gridSize = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.hide();
  mic = new p5.AudioIn();
  mic.start();
  drawButton(width / 2, height / 2 + 400, 200, 40);
}

function draw() {
  background(245, 245, 220, 100);
  drawAntenna();
  drawScreen();
  drawStereo(width / 2 - 550, height / 2, 200, 400);
  drawStereo(width / 2 + 550, height / 2, 200, 400);
  textStyle(ITALIC);
  displayText(width / 2, height / 2 + 375, 40, "the digital you");
}

function drawScreen() {
  push();
  rectMode(CENTER);
  strokeWeight(10);
  fill(0, 200);
  rect(width / 2, height / 2, 645, 485);
  fill(255, 15);
  rect(width / 2, height / 2, 810, 610);
  pop();
  push();
  textSize(gridSize);
  textAlign(LEFT, TOP);
  cam.loadPixels();
  for (let y = 0; y < cam.height; y += gridSize) {
    for (let x = 0; x < cam.width; x += gridSize) {
      let index = (x + y * cam.width) * 4;
      // cam
      let camR = cam.pixels[index + 0];
      let camG = cam.pixels[index + 1];
      let camB = cam.pixels[index + 2];
      let camA = cam.pixels[index + 3];
      let grayScl = (camR + camG + camB) / 3;
      fill(camR, camG, camB, camA);
      if (grayScl < 37) {
        text("<>", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      } else if (grayScl < 74) {
        text("[]", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      } else if (grayScl < 111) {
        text("{}", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      } else if (grayScl < 148) {
        text("!=", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      } else if (grayScl < 185) {
        text("#", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      } else if (grayScl < 222) {
        text("''", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      } else if (grayScl <= 255) {
        text("&&", x + (width - cam.width) / 2, y + (height - cam.height) / 2);
      }
    }
  }
  pop();
}

function drawAntenna() {
  push();
  strokeWeight(10);
  line(width / 2 - 200, height / 2 - 305, width / 2 - 250, height / 2 - 550);
  line(width / 2 + 200, height / 2 - 305, width / 2 + 250, height / 2 - 550);
  pop();
}

function drawStereo(x, y, w, h) {
  push();
  rectMode(CENTER);
  translate(x, y);
  let level = mic.getLevel();
  let diaIndex = map(level, 0, 1, 0.8, 1.5);
  strokeWeight(7);
  fill(220, 20, 60, 175)
  rect(0, 0, w, h);
  fill(30, 240)
  circle(0, 0, diaIndex * 0.85 * w);
  rect(0, 0.35 * h, 0.7 * w, 0.1 * h);
  fill(220, 200)
  circle(0, 0, diaIndex * 0.3 * w);
  pop();
}

function drawButton(x, y, w, textsize) {
  push();
  rectMode(CENTER);
  let button = createButton('Continue')
  button.addClass('p5Button');
  button.style('width', w + 'px');
  button.position(x - w / 2, y);
  button.style('font-size', textsize + 'px');
  button.mouseClicked(function() {
    window.open('minigame2.html', "_self");
  })
  pop();
}

function displayText(x, y, size, content) {
  push();
  rectMode(CENTER)
  textAlign(CENTER);
  textSize(size);
  text(content, x, y)
  pop();
}