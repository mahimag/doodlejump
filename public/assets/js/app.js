var GRAVITY = - 0.6;
var player;
var platforms = [];
var points;
var bg;
var buttonPressed = false;
var gameOver = false;
var img;
var score = 0;
var song;
var highScore = 0;
//images
var difficulty = 0.90;
var numPlatforms = 30;


//utils
getRandomValue = function(max,min){
  let val = Math.random() * (max - min) + min;
  return Math.round(val);
}

//canvas set up + definitions
function setup(){
  createCanvas(400,600);
  img = loadImage("public/assets/images/doodleenemy.png");
  bg = loadImage("public/assets/images/backdrop2.jpg");
  button = createButton("Play");
  button.mousePressed(play);
  button.addClass("button");
  highScore = localStorage.getItem('doodleHigh') || 0;
}

//canvas creation + player defined
function play(){
  createCanvas(400,600);
  bg = loadImage("public/assets/images/background.png");
  player = new Doodler(width/2,height/2,false);
  platforms = generatePlatforms();
  points = 0;
  frameRate(30);
  buttonPressed=true;
}

//main / game flow
function draw(){
  if (buttonPressed){
    background(bg);
    handlePlatforms();
    handlePlayer();
    drawScore();
    handleKeys();
  }else{
    background(bg);
    if(gameOver){
      endGame();
    }
  }
}


/*
 * updates, draws, and applies GRAVITY to player
 * checks if the player falls
 */
function handlePlayer() {
	player.update();
  player.draw();
  if(player.loc.y < 0){
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
      //if platform moves
      if(platforms[i].moving && !platforms[i].hasSpring && platforms[i] instanceof Platform){
        platforms[i].update(true);
        platforms[i].drawMoving(platforms[i].altitude);
      }
      //if platform has spring
      if(platforms[i].hasSpring){
        platforms[i].draw(player.loc.y);
        //handles special boost
        if(platforms[i].collidesWith(player)){
          player.jump(25);
        }
      }
      //draws regular platform
      platforms[i].draw(player.loc.y);
      
      //handles doodler on platform
			if (platforms[i] instanceof Doodler)
				platforms[i].update();
      if (platforms[i].collidesWith(player)) {
        //regular jump
        player.jump(15);
        if (platforms[i] instanceof Doodler) {
					// it's not a platform, but an enemy
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
      if (random() < 0.95) {
				// 90% chance of platform
        platforms.push(new Platform(x, y, Math.random() > difficulty , Math.random() > difficulty));
        difficulty -= 0.0001;
      } else {
        if (random() < (difficulty - 0.3)) {
					// 5% chance of being a doodler
					platforms.push(new Doodler(x, y, true));
          difficulty -= 0.0001;
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
var random_boolean = 0;
var p;

function generatePlatforms() {
  platforms = [];
  stepSize = Math.floor(canvas.height / 10);
  for(let i=numPlatforms; i>=1; i--){ // 8
    //starter platform
    p = new Platform(getRandomValue(0,canvas.width-60), i*50, Math.random() > difficulty, Math.random() > difficulty + .09);
    p.onScreen = true;
    platforms.push(p);
  }
  return platforms;
}

/**
 * moves player based upon user input
 */
function handleKeys() {

  if (keyIsDown(LEFT_ARROW)) {
    player.lookRight = false;
    player.updateImg();
    player.applyForce(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.lookRight = true;
    player.updateImg();
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

  if(gameOver){
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
  }
}
