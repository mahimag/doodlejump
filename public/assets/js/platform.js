function Platform(x,altitude, img, moving, hasSpring){
  this.x = x;
  this.altitude = altitude;//altitude
  this.dx = 4; // 0 when still
  this.dy = 1;
  this.img = img;
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
  //this code
  // this.drone += map(this.altitude, 0, 15000, 0.0001, 0.1);
  // this.loc.x = (Math.sin(this.drone) * (width / 2)) + width / 2;

  // this.draw(this.altitude);
  
  // worked
  if(random_boolean){
    if(this.x > canvas.width-this.s || this.x <= 0){
        this.dx*= -1;
    }
    this.x += this.dx;
  }
  //
  // if(this.x + this.radius > canvas.width || this.x < 0){
  //         this.dx = -this.dx;
  // }
  // this.x += this.dx;

  //this.drawMoving(this.loc.x, this.altitude);
}

Platform.prototype.draw = function(altitude){
  
  if(altitude - this.altitude < height/2){
    image(this.img,this.x,(altitude-this.altitude + height/2),this.s,15);
    if(this.moving){
      this.drawMoving();
    }
  /*
  //
  stroke("#FF0000");
  strokeWeight(2);
  rect(this.x,(altitude-this.altitude + height/2),this.s,15);
  //
  */
  }else{
    this.onScreen = false;
  }
};

//draws moving platform
Platform.prototype.drawMoving = function(altitude){
  // if it is on-screen
  if(altitude - this.altitude < height/2){

  image(this.img, this.loc.x, (this.altitude - this.loc.altitude + height/2),this.s, 15); //might want to change this.altitude to altitude

  // if(x - this.x < height/2){
  //   image(this.img,(x-this.x + height/2),this.altitude,this.s,15);
  }else{
    this.onScreen = false;
  }
};

//draws platform w spring
//need to draw relative to platform
Platform.prototype.drawSpring = function(altitude){
  // draw relative to platforms
  if (altitude - this.loc.y < height) {
    //image(this.img, this.loc.x, (altitude - this.loc.altitude + height/2),this.s, 15); //might want to change this.altitude to altitude
    //drawing the spring on top of platform
    image(this.spring, this.loc.x + 100, (altitude - this.loc.altitude + height/2) - 100, this.s, 15); //might want to change this.altitude to altitude
  }else{
    this.onScreen = false;
  }
  
};


Platform.prototype.collidesWith = function(doodler){
  var pT = this.altitude; //platform altitude
  var dB = doodler.loc.y - (doodler.s/2); // doodler bottom
   // stroke("#FF0000");
   // strokeWeight(10);
   // line(this.x,this.altitude,this.x+50,this.altitude);
  // var og = Math.abs(pT - db); // <
  // var value = pT - db;
  if(Math.abs(pT - dB) < - doodler.vel.y && (pT < dB)){
     var pLX = this.x ; // platform left most x bound
     var pRX = this.x + this.s;//platform right most x bound
     var dLX = doodler.loc.x;//doodler left most x bound
     var dRX = doodler.loc.x + (doodler.s/2);//doodler right most x bound
     var x = doodler.loc.x;
    /*
    comment out: 
    */
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