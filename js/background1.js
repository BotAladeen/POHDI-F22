//censored expressions flying around

let floatingItems = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.class("background");
  background(255);
  for (i = 0; i < 25; i++) {
    floatingItems.push(
      new Char(random(width), random(height), random(-5, 5), random(-5, 5), 50)
    );
  }
}

function draw() {
  background(245, 245, 220);
  for (i = 0; i < floatingItems.length; i++) {
    let f = floatingItems[i];
    f.move();
    f.Wiggle();
    f.bump();
    f.display();
  }
}
class Char {
  constructor(x, y, xSpd, ySpd, size) {
    this.x = x;
    this.y = y;
    this.xSpd = xSpd;
    this.ySpd = ySpd;
    this.size = size;
    this.wiggle = 0;
    this.wigglevar = random(-3, 3);
    this.type = random(["money", "death", "body"]);
  }
  display() {
    push();
    textSize(this.size);
    textAlign(CENTER);
    translate(this.x, this.y);
    rotate(this.wiggle);
    if (this.type == "money") {
      fill(17, 140, 79);
      text("赚米", 0, 0);
    } else if (this.type == "death") {
      fill("Gold");
      text("笑S", 0, 0);
    } else if (this.type == "body") {
      fill(204, 35, 42);
      text("身T", 0, 0);
    }
    pop();
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  Wiggle() {
    this.wiggle = 0.5 * sin(0.05 * frameCount + this.wigglevar);
  }
  bump() {
    if (this.x < 0 || this.x > width) {
      this.xSpd = -this.xSpd;
    }
    if (this.y < 0 || this.y > height) {
      this.ySpd = -this.ySpd;
    }
  }
}