let borderRVar;
let borderGVar;
let borderBVar;
let bkgR = 245;
let bkgG = 245;
let bkgB = 220;
let doorOpen;
let doorClose;
let censoredWords = ['身T', '笑S', '赚米', '笑S', '口罩', 'Z高', '购M', 'Y会'];
let originalWords = ['身体', '笑死', '赚钱', '笑死', '疫情', '最高', '购买', '约会'];
let stars = [];
let targets = [];
let ball;
let plank;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.class("background");
  borderRVar = random(-4, 4);
  borderGVar = random(-4, 4);
  borderBVar = random(-4, 4);
  doorOpen = loadSound('assets/mc-door-open.mp3');
  doorClose = loadSound('assets/mc-door-close.mp3');
  drawExitButton();
  buildStars(50);
  buildTargets(20);
  ball = new Pinball(width / 2, height * 0.8, 5, 7);
  plank = new Plank(width / 2, height - 35, 150);
}

function draw() {
  if (bkgR > 10) {
    bkgR -= 235 / 90;
    bkgG -= 235 / 90;
    bkgB -= 210 / 90;
  }
  background(bkgR, bkgG, bkgB);
  drawInnerBkg();
  drawStars();
  drawMessage(width / 2, height / 2, 45, "It's not that difficult!");
  for (i = 0; i < targets.length; i++) {
    let t = targets[i];
    t.display();
    t.detect();
    if (t.isHit) {
      targets.splice(i, 1);
    }
  }
  if (targets.length > 0) {
    ball.move();
    if (ball.x <= width / 2 - height / 2 + ball.size + 10 || ball.x >= width / 2 + height / 2 - ball.size - 10) {
      ball.xBump();
    }
    if ((ball.x >= mouseX - plank.w / 2 && ball.x <= mouseX + plank.w / 2 && ball.y >= plank.y - ball.size - 20)) {
      ball.yBump();
      plank.clr = random([color(125, 249, 255), color(10, 186, 181), color(223, 255, 0), color(147, 197, 114), color(255, 16, 240), color(243, 58, 106), color(93, 63, 211), color(255, 36, 0), color(253, 218, 13), color(238, 75, 43)]);
      ball.clr = plank.clr;
      //when plank meets ball
    }
    if (ball.y >= height - ball.size || ball.y <= ball.size) {
      ball.yBump();
    }
    ball.display();
    plank.followMouse();
    plank.display();
  }
  if (bkgR <= 10 && targets.length != 0) {
    showHelp(25);
  }
  drawHider();
  drawDoor();
}

function showHelp(size) {
  push();
  textSize(size);
  fill(255, 200);
  text("Words to be Rescued: " + targets.length, 0, 1 * size);
  fill(128, 200);
  text("press S for new stars", 0, 2.5 * size);
  text("press T for new targets", 0, 3.5 * size);
  text("press B for a new ball", 0, 4.5 * size);
  pop();
}

function keyPressed() {
  if (key == ' ') {
    targets.splice(0, targets.length);
  } else if (key == 's') {
    stars.splice(0, stars.length);
    buildStars(50);
  } else if (key == 't') {
    targets.splice(0, targets.length);
    buildTargets(20);
  } else if (key == 'b') {
    ball = new Pinball(width / 2, height * 0.8, 5, 7);
  }
}

function drawMessage(x, y, size, message) {
  push();
  translate(x, y);
  rectMode(CENTER);
  textAlign(CENTER);
  textSize(size);
  textFont('fantasy');
  fill(255, 255, 255, 100);
  text(message, 0, 0, 500, 300);
  pop();
}

function drawHider() {
  push();
  rectMode(CENTER);
  noStroke();
  fill(bkgR, bkgG, bkgB);
  rect((width / 2 - height / 2) / 2, height - 50, width / 2 - height / 2 - 10, 100);
  rect(width - (width / 2 - height / 2) / 2, height - 50, width / 2 - height / 2 - 10, 100);
  pop();
}

function drawInnerBkg() {
  push();
  rectMode(CENTER);
  stroke(128 + 10 * borderRVar + 127 * sin(1.35 * frameCount + borderRVar), 128 + 10 * borderGVar + 127 * sin(1.65 * frameCount + borderGVar), 128 + 10 * borderBVar + 127 * sin(1.95 * frameCount + borderBVar));
  strokeWeight(10);
  fill(0, 0, 54);
  rect(width / 2, height / 2, height, height);
  if (mouseX >= width / 2 - height / 2 && mouseX <= width / 2 + height / 2) {
    noCursor();
  } else {
    cursor(ARROW);
  }
  pop();
}

//Pinball
class Pinball {
  constructor(x, y, size, spd) {
    this.x = x;
    this.y = y;
    this.spd = spd;
    this.dir = -120;
    this.xSpd = 0;
    this.ySpd = 0;
    this.size = size;
    this.clr = color(245, 245, 220);
  }
  display() {
    push();
    rectMode(CENTER);
    strokeWeight(5);
    stroke(this.clr);
    fill(0, 0);
    rect(this.x, this.y, 20, 20);
    pop();
  }
  move() {
    push();
    angleMode(DEGREES);
    this.xSpd = this.spd * cos(this.dir);
    this.ySpd = this.spd * sin(this.dir);
    this.x += this.xSpd;
    this.y += this.ySpd;
    pop();
  }
  xBump() {
    this.dir = 180 - this.dir;
    this.dir += random(-20, 20);
  }
  yBump() {
    this.dir = -this.dir;
    this.dir += random(-20, 20);
  }
}
//Stars
class Star {
  constructor() {
    this.x = random(width / 2 - height / 2 + 10, width / 2 + height / 2 - 10);
    this.y = random(10, height - 10);
    this.size = random(5, 15);
    this.brightness = random(75, 150);
  }
  display() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(255, this.brightness);
    rect(this.x, this.y, this.size, this.size);
    pop();
  }
}

function buildStars(count) {
  for (i = 0; i < count; i++) {
    stars.push(new Star());
  }
}

function drawStars() {
  for (i = 0; i < stars.length; i++) {
    stars[i].display();
  }
}

//Targets
function buildTargets(count) {
  for (i = 0; i < count; i++) {
    let idx = int(random(0, censoredWords.length));
    curW = 100;
    curH = 50;
    curX = random(width / 2 - height / 2 + curW / 2 + 10, width / 2 + height / 2 - curW / 2 - 10);
    curY = random(curH / 2 + 10, height * 0.7 - curH / 2 - 10);
    for (i = 1; i < targets.length; i++) {

    }
    targets.push(new Target(curX, curY, curW, curH, censoredWords[idx]));
  }
}

class Target {
  constructor(x, y, w, h, content) {
    this.content = content;
    this.w = w;
    this.h = h;
    this.size = 40;
    this.x = x;
    this.y = y;
    this.isHit = false;
  }
  display() {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    fill(0, 0);
    stroke(255, 200);
    strokeWeight(5);
    rect(this.x, this.y, this.w, this.h);
    fill(255, 200);
    noStroke();
    textSize(this.size);
    text(this.content, this.x, this.y);
    pop();
  }
  detect() {
    push();
    let xL = this.x - this.w / 2 - ball.size / 2;
    let xR = this.x + this.w / 2 + ball.size / 2;
    let yLow = this.y - this.h / 2 - ball.size / 2;
    let yHigh = this.y + this.h / 2 + ball.size / 2;
    if ((abs(ball.x - xR) <= 3 || abs(ball.x - xL) <= 3) && (ball.y >= yLow && ball.y <= yHigh)) {
      ball.xBump();
      this.isHit = true;
    }
    if ((abs(ball.y - yHigh) <= 3 || abs(ball.y - yLow) <= 3) && (ball.x >= xL && ball.x <= xR)) {
      ball.yBump();
      this.isHit = true;
    }
    pop();
  }
}

//Plank
class Plank {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.clr = color(245, 245, 220);
  }
  display() {
    push();
    if (mouseX >= width / 2 - height / 2 - this.w / 2 && mouseX <= width / 2 + height / 2 + this.w / 2) {
      translate(this.x, this.y);
      rectMode(CENTER);
      fill(0, 0);
      stroke(this.clr);
      strokeWeight(5);
      rect(0, 0, this.w, 15);
    }
    pop();
  }
  followMouse() {
    this.x = mouseX;
    this.y = mouseY;
  }
}

//Door/Button Thingy
function drawExitButton() {
  push();
  let button = createButton('next');
  button.style('background-color', color(0, 0));
  button.style('color', color(0, 0));
  button.style('border', '0px solid #FFFFFF');
  button.style('padding', ((width / 32) + 'px ' + (height / 40) + 'px'));
  button.position(width - 2 * width / 36, height - width / 12);
  button.mouseOver(function() {
    outputVolume(0.5);
    doorOpen.play();
  });
  button.mouseOut(function() {
    outputVolume(0.5);
    doorClose.play();
  });
  button.mouseClicked(function() {
    window.open('end-page.html', "_self");
  });
  pop();
}

function drawDoor() {
  x = width - width / 36 - 10;
  y = height - (width / 24 + 10);
  w = width / 18;
  h = width / 12
  push();
  translate(x, y);
  rectMode(CENTER);
  strokeWeight(4);
  fill(bkgR, bkgG, bkgB);
  stroke(255);
  rect(0, 0, w, h);
  circle(0.4 * w, 0, 0.1 * w);
  pop();
}