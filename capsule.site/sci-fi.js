'use strict';
/* eslint no-undef:off, no-unused-vars:off, new-cap:off, no-new:off */

new p5(function (p5) {
  function Boid (x, y, mass) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.m = mass;
    this.h = 100;
    this.s = 0;
    this.b = 100;
    return (this);
  }

  (function () {
    var g = 1;
    var bounceForce = 0.2;
    var maxspeed = 1;

    Boid.prototype.applyForce = function (fx, fy) {
      this.build(fx, fy);
      this.ax += fx;
      this.ay += fy;
    };

    Boid.prototype.build = function (fx, fy) {
      p5.push();
      p5.strokeWeight(1);
      p5.stroke(this.h, this.s, this.b);
      var delta = fx / fy;
      var ampl = (Math.pow(fx, 2) + Math.pow(fy, 2));
      p5.line(this.x, this.y, this.x + ampl * delta, this.y + ampl / delta);
      p5.pop();
    };

    Boid.prototype.bounce = function () {
      if (this.x < 0) {
        this.applyForce(bounceForce, 0);
      } else if (this.x > p5.width) {
        this.applyForce(-bounceForce, 0);
      }
      if (this.y < 0) {
        this.applyForce(0, bounceForce);
      } else if (this.y > p5.height) {
        this.applyForce(0, -bounceForce);
      }
    };

    Boid.prototype.applyBehaviour = function (boids) {
      var totMass, fx, fy, xovery, deltax, deltay, f;
      for (var i in boids) {
        if (boids[i] !== this) {
          deltax = boids[i].x - this.x;
          deltay = boids[i].y - this.y;
          xovery = deltax / deltay;
          totMass = this.m + boids[i].m;
          f = totMass / (Math.pow(deltax, 2) + Math.pow(deltay, 2));
          fx = g * f * xovery;
          fy = g * f / xovery;
          this.applyForce(fx, fy, totMass);
        }
      }
    };

    Boid.prototype.setColor = function (h, s, b) {
      this.h = h;
      this.s = s;
      this.b = b;
    };

    Boid.prototype.update = function () {
      this.bounce();
      this.vx += this.ax;
      this.vy += this.ay;
      this.vx = Math.sign(this.vx) * Math.min(Math.abs(this.vx), maxspeed);
      this.vy = Math.sign(this.vy) * Math.min(Math.abs(this.vy), maxspeed);
      this.x += this.vx;
      this.y += this.vy;
      this.ax = 0;
      this.ay = 0;
    };
  })();

  var boids;
  var n = 10;

  var INIT_H = 202;
  var INIT_S = 40;
  var INIT_B = 100;
  document.getElementsByTagName('body')[0].style.backgroundColor = 'hsb(' + h + ', ' + s + ', ' + b + ')';
  var h = INIT_H;
  var s = INIT_S;
  var b = INIT_B;
  var H = 360;
  var S = 100;
  var B = 100;
  var maxH = H;
  var maxS = S;
  var maxB = B;

  p5.setup = function () {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.colorMode(p5.HSB, H, S, B);
    boids = [];
    var i = 0;
    var mass = 0.005 * Math.max(p5.width, p5.height);
    while (i <= n) {
      boids[i++] = new Boid(Math.random() * p5.width, Math.random() * p5.height, mass);
    }
    p5.background(h, s, b);
  };

  p5.draw = function () {
    var i = 0;
    while (i <= n) {
      boids[i].applyBehaviour(boids);
      boids[i].update();
      boids[i++].setColor(h, s, b);
    }
    h = (h + 0.05) % maxH;
    if (s <= maxS) s += 0.05;
    if (b <= maxB) b++;
  };

  p5.windowResized = function () {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    h = INIT_H;
    s = INIT_S;
    b = INIT_B;
    p5.background(h, s, b);
  };
});
