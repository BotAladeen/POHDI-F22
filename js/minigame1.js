//work for tomorrow:
//update messages below
//work out the door-button
//add mc sound effect to the door
//incorporate two tv pages
//a new space invaders-like minigame where bkg gets brighter as more censored expressions are eliminated
//say-it pages might not be no longer necessary
//end page with summary, if time permits
let bkgR = 245;
let bkgG = 245;
let bkgB = 220;
let messages = ["the fact of the matter is", "body, money and death are just everywhere", "and they are about every one of us", "their usage deserves to be in the sunlight"];
let fixedMessages = [];
let floatingItems = [];
let doorOpen;
let doorClose;

function setup() {
  doorOpen = loadSound('assets/mc-door-open.mp3');
  doorClose = loadSound('assets/mc-door-close.mp3');
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.class("background");
  noCursor();
  xStep = width / (messages.length + 1);
  yStep = height / (messages.length + 1);
  for (i = 0; i < messages.length; i++) {
    fixedMessages.push(new Message(xStep * (i + 1), yStep * (i + 1), 30, messages[i], random([-10, 10]) + random(-5, 5)));
  }
  for (i = 0; i < 50; i++) {
    floatingItems.push(new Char(random(width), random(height), random(-2, 2), random(-2, 2), 30));
  }
  push();
  let button = createButton('next');
  button.style('background-color', color(0, 0));
  button.style('color', color(0, 0));
  button.style('border', '0px solid #FFFFFF');
  button.style('padding', ((width / 32) + 'px ' + (height / 40) + 'px'));
  button.position(width - 2 * width / 36, 15);
  button.mouseOver(function() {
    outputVolume(0.5);
    doorOpen.play();
  });
  button.mouseOut(function() {
    outputVolume(0.5);
    doorClose.play();
  });
  button.mouseClicked(function() {
    window.open('transition-page.html', "_self");
  });
  pop();
}

function draw() {
  background(bkgR, bkgG, bkgB, 100 + 0.75 * frameCount);
  drawHalo(mouseX, mouseY);
  if (bkgR < 1) {
    drawDoor(width - width / 36 - 10, width / 24 + 10, width / 18, width / 12);
  }

  drawSpotlight(mouseX, mouseY);

  for (i = 0; i < floatingItems.length; i++) {
    let f = floatingItems[i];
    f.move();
    f.bump();
    f.change();
    f.display();
    f.detectCollision(width / 8 - 10);
  }
  if (bkgR < 1) {
    for (i = 0; i < fixedMessages.length; i++) {
      fixedMessages[i].display();
    }
  }
  drawPerson(mouseX, mouseY);
}

class Message {
  constructor(x, y, size, message, rotation) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.message = message;
    this.rotation = rotation;
  }
  display() {
    push();
    translate(this.x, this.y);
    angleMode(DEGREES);
    rectMode(CENTER);
    textAlign(CENTER);
    rotate(this.rotation)
    textSize(this.size);
    fill(0, 0, 0, 255);
    text(this.message, 0, 0);
    pop();
  }
}

class Char {
  constructor(x, y, xSpd, ySpd, size) {
    this.x = x;
    this.y = y;
    this.xSpd = xSpd;
    this.ySpd = ySpd;
    this.size = size;
    this.type = random(["body", "money", "laugh"]);
    this.language = random(['cn', 'eng']);
    if (this.type == "money") {
      this.color = color(17, 140, 79);
    } else if (this.type == "laugh") {
      this.color = color(255, 215, 0);
    } else {
      this.color = color(204, 35, 42);
    }
    this.p = 0;
    this.chance = 0.25;
    this.censored = false;
    this.greeting = random(["hi there!", "how are you doing?", "It's me!"])
  }
  display() {
    push();
    textSize(this.size);
    textAlign(CENTER);
    translate(this.x, this.y);
    if (this.censored == false) {
      fill(this.color);
      if (this.language == 'cn') {
        if (this.type == "money") {
          text("赚钱", 0, 0);
        } else if (this.type == "laugh") {
          text("笑死", 0, 0);
        } else {
          text("身体", 0, 0);
        }
      } else {
        text(this.type, 0, 0);
      }
    } else {
      if (this.type == "money") {
        text("赚米", 0, 0);
      } else if (this.type == "laugh") {
        text("笑S", 0, 0);
      } else if (this.type == "body") {
        text("身T", 0, 0);
      }
    }
    pop();
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  bump() {
    if (this.x < 0 || this.x > width) {
      this.xSpd = -this.xSpd;
    }
    if (this.y < 0 || this.y > height) {
      this.ySpd = -this.ySpd;
    }
  }
  detectCollision(range) {
    push();
    textAlign(CENTER, BOTTOM);
    textSize(20);
    if (dist(this.x, this.y, mouseX, mouseY) <= range) {
      fill(this.color);
      text(this.greeting, this.x, this.y - 25);
    }
    pop();
  }
  change() {
    this.p = random(0, 100);
    if (this.p < this.chance && this.censored == false) {
      this.censored = true;
      this.greeting = "boo!!"
      this.color = color(45);
      bkgR -= 4.9;
      bkgG -= 4.9;
      bkgB -= 4.4;
    }
  }
}

function drawSpotlight(x, y) {
  push();
  translate(x, y)
  scale(0.5);
  noStroke();
  fill("Ivory");
  circle(0, 0, width / 12);
  pop();
}

function drawHalo(x, y) {
  push();
  translate(x, y)
  scale(1);
  noStroke();
  fill("LightYellow");
  circle(0, 0, width / 4);
  pop();
}

function drawPerson(x, y) {
  push();
  translate(x, y);
  strokeWeight(3);
  fill(255, 0);
  scale(0.5);
  circle(0, -width / 48, width / 48);
  line(0, -width / 96, 0, width / 96);
  line(-width / 48, -width / 220, width / 48, -width / 220);
  line(0, width / 96, width / 60, width / 30);
  line(0, width / 96, -width / 60, width / 30);
  pop();
}

function drawDoor(x, y, w, h) {
  push();
  translate(x, y);
  rectMode(CENTER);
  strokeWeight(4);
  fill(0, 255);
  stroke(255);
  rect(0, 0, w, h);
  circle(0.4 * w, 0, 0.1 * w);
  pop();
}