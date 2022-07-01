function Platform(x,altitude, moving, hasSpring){
  this.x = x;
  this.altitude = altitude;//altitude
  this.dx = 4; // 0 when still
  this.dy = 1;
  this.img = loadImage("public/assets/images/grass.png");
  this.img2 = loadImage("public/assets/images/tile-blue.png");
  this.spring = loadImage("public/assets/images/spring.png");
  this.onScreen = true;
  this.s = 50;
  this.drone = 0;
  this.loc = createVector(x,altitude);
  this.moving = moving;
  this.hasSpring = hasSpring;
}

//updates the platform by moving it vertically
Platform.prototype.update = function(random_boolean){
  if(random_boolean){
    if(this.x > canvas.width-this.s || this.x <= 0){
        this.dx*= -1;
    }
    this.x += this.dx;
  }
}

Platform.prototype.draw = function(altitude){
  if(altitude - this.altitude < height/2){
    image(this.img,this.x,(altitude-this.altitude + height/2),this.s,15);
    if(this.moving && !this.hasSpring){
      image(this.img2, this.x, (altitude - this.altitude + height/2), this.s, 15);
    }
    if(this.hasSpring && !this.moving){
      image(this.spring, this.x, (altitude - this.altitude + height/2) - 8, this.s, 15);
    }
  }else{
    this.onScreen = false;
  }
};

//draws moving platform
Platform.prototype.drawMoving = function(altitude){
  // if it is on-screen
  if(altitude - this.altitude < height/2){
    image(this.img, this.loc.x, (this.altitude - this.loc.altitude + height/2), this.s, 15);
  }else{
    this.onScreen = false;
  }
};


Platform.prototype.collidesWith = function(doodler){
  var pT = this.altitude; //platform altitude
  var dB = doodler.loc.y - (doodler.s/2); // doodler bottom
  if(Math.abs(pT - dB) < - doodler.vel.y && (pT < dB)){
     var pLX = this.x ; // platform left most x bound
     var pRX = this.x + this.s;//platform right most x bound
     var dLX = doodler.loc.x;//doodler left most x bound
     var dRX = doodler.loc.x + (doodler.s/2);//doodler right most x bound
     var x = doodler.loc.x;
     if((dLX >= pLX && dLX <= pRX) || (dRX >= pLX && dRX <= pRX)){
       return true;
     }
    }
  return false;
};

// //updates the platform by moving it horizontally
// Platform.prototype.updateMoveH = function(){
//   if(this.x + this.radius > canvas.width || this.x < 0){
//       this.dx = -this.dx;
//   }
//   this.x += this.dx;
//   this.draw();
// }

Platform.prototype.updateMoveV = function(){
  if(this.altitude + this.radius > canvas.height || this.altitude < 0){
      this.dy = -this.dy;
  }
  this.altitude += this.dy;
  this.draw();
}