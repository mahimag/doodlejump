var GRAVITY = - 0.6;
var player;
var platforms = [];
var points;
var bg;
var buttonPressed = false;
var gameOver = false;
//var img;
var img2;
var score = 0;
var song;
var highScore = 0;

//trying to change mouse here
// addEventListener('mousemove', function(event) {
//     console.log(event);
//     //creates object with x and y coordinates
//     mouse.x = event.x;
//     mouse.y = event.y;
// })

/*
utils
*/
getRandomValue = function(max,min){
  let val = Math.random() * (max - min) + min;
  return Math.round(val);
}

function setup(){
  createCanvas(400,600);
  // img = loadImage("public/assets/images/backdrop2.jpg");
  img2 = loadImage("public/assets/images/doodleenemy.png");
  // bg = loadImage("public/assets/images/background.png");
  bg = loadImage("public/assets/images/backdrop2.jpg");
  button = createButton("Play");
  button.mousePressed(play);
  button.addClass("button");
  highScore = localStorage.getItem('doodleHigh') || 0;
}

function entryInfo(){
  if(gameOver){
  // image(img,50,100,300,100);
  textAlign(CENTER);
  textSize(50);
  noStroke();
  fill("rgb(104,153,34)");
  text("Game Over!", width / 2, height / 2);
  textAlign(CENTER);
  textSize(30);
  noStroke();
  fill("rgb(169,40,34)");
  text(`Score : ${score}`,width / 2 , height / 2 +35)
  button = createButton("Play");
  button.mousePressed(play);
  button.addClass("button");
}else{
  //image(img2,155,-15,90,50);
}
}

function play(){
  createCanvas(400,600);
  bg = loadImage("public/assets/images/background.png");
  player = new Doodler(width/2,height/2,false);
  platforms = generatePlatforms();
  points = 0;
  frameRate(30);
  buttonPressed=true;
}


function draw(){
  if (buttonPressed){
    background(bg);
    /*
    */
    handlePlatforms();
    handlePlayer();
    drawScore();
    handleKeys();
  }else{
  background(bg);
  entryInfo();
  }
}


/*
 * updates, draws, and applies GRAVITY to player
 * checks if the player falls
 */
function handlePlayer() {
	player.update();
  player.draw();
  if (player.maxA + player.loc.y < -height / 2) {
    endGame();
  }
}

/**
 * checks collision, draws, and manages all platforms
 */
function handlePlatforms() {

  for (var i = platforms.length - 1; i >= 0; i--) {
		// loop through platforms backward
    if (platforms[i].onScreen) {
      platforms[i].draw(player.loc.y);
			if (platforms[i] instanceof Doodler)
				platforms[i].update(); // update Doodlers
      if (platforms[i].collidesWith(player)) {
        /* if player collides with a power booster attached to platform
        */
        player.jump();
        if (platforms[i] instanceof Doodler) {
					// it's not a platform, but a doodler!
          points += 100;
          platforms.splice(i, 1); // remove from array
        }
      }
    } else {

      /* no longer on-screen, delete previous platforms */
      platforms.splice(i, 1);
			/* push new platform */
      var x = noise(player.maxA, frameCount) * width;
      var y = player.maxA + height;
      if (random() < 0.9) {
				// 90% chance of being a regular platform
        platforms.push(new Platform(x, y));
      } else {
        if (random() > 0.5) {
					// 5% chance of being a doodler
					platforms.push(new Doodler(x, y, true));
				}
				// 5% chance of not regenerating
      }
    }
  }
  
}

/**
 * initializes platforms
 */
var platforms = [];
var stepSize = 0;
var y_arr = []
var flag = true;
function generatePlatforms() {
  platforms = [];
  while(flag){
    stepSize = Math.floor(canvas.height / 10);
    //for(let i = height; i>= 0; i-= stepSize){
    for(let i=25; i>=0; i--){ // 8
      let p = new Platform(getRandomValue(0,canvas.width-60), i*50);
      p.onScreen = true;
      y_arr.push(p.altitude);
      platforms.push(p);
      //sort by y length , if the y length between any of them is greater than the jumping distance, generate new platforms...
      console.log(platforms[i]);
    }
    sort(y_arr); // 1 2 3 4 5 6 7 8 9 .. 25
    let dist = 0;
    for(var j=0; j<y_arr.length; j++){
      if(dist < y_arr[j+1] - y_arr[j]){
        dist = y_arr[j+1] - y_arr[j];
      }
      if(j == (y_arr.length - 1)){
        break;
      }
    }
    if(dist < 50){ //might change this num
      flag = false;
    }
  }
  return platforms;

  //
  stepSize = Math.floor(canvas.height / 10); //where 10 is num of steps per screen
  for (let y = height; y > 0; y -= stepSize) {
    const x = Platform.w / 2 + (width - Platform.w) * Math.random();
    let type = Platform.platformTypes.getRandomType();
    while (type === Platform.platformTypes.FRAGILE) {
      type = Platform.platformTypes.getRandomType();
    }
    const springed = Math.random() < config.SPRINGED_CHANCE;
    platforms.push(new Platform(x, y, type, springed));
  }
  //

	// var platforms = []; // returning array
  // var x_arr = [];
  // var y_arr =  [];
	// for (var y = 0; y < height * 3; y += 40) {
	// 	// loop through Y
  //   for (var i = 0; i < 3; i++) { // attempt 3 new platforms
  //     var x = noise(i, y) * width;
  //     while (x_arr.includes(x)){
  //       x = noise(i, y) * width;
  //     }

  //     if (noise(y, i) > 0.5){ // 50% chance of a new platform
  //       platforms.push(new Platform(x, y));
  //     }
  //       x_arr <<  x ;

  //   }
  // }

	//return platforms;
}
/**
 * moves player based upon user input
 */
function handleKeys() {

  if (keyIsDown(LEFT_ARROW)) {

    player.applyForce(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {

    player.applyForce(1, 0);
  }
}

/**
 * draws the score
 */
function drawScore() {

  textSize(20);
  textAlign(LEFT);
  fill("#000000");
  noStroke();
  score = (player.maxA + points - 300).toFixed(0)
  text(`Score : ${(player.maxA + points - 300).toFixed(0)}`,10,25);
  text(`High Score : ${(highScore)}`,10,45);
}

/**
 * ends loop, draws game over message
 */
function endGame() {
  gameOver = true ;
  buttonPressed = false;

  if(parseInt(score)> highScore) {
    highScore = parseInt(score);
    localStorage.setItem('doodleHigh', highScore);
  }
  // clearing data
  // localStorage.clear();

  console.log(score);
  console.log(highScore);

  // song.play();
}
