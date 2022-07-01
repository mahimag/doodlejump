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

/*
utils
*/
getRandomValue = function(max,min){
  let val = Math.random() * (max - min) + min;
  return Math.round(val);
}

function setup(){
  createCanvas(400,600);
  img = loadImage("public/assets/images/doodleenemy.png");
  bg = loadImage("public/assets/images/backdrop2.jpg");
  gPlatform = loadImage("public/assets/images/grass.png");
  bPlatform = loadImage("public/assets/images/tile-blue.png");
  button = createButton("Play");
  button.mousePressed(play);
  button.addClass("button");
  highScore = localStorage.getItem('doodleHigh') || 0;
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
  // if (player.maxA + player.loc.y < -height / 2) {
  //   endGame();
  // }
  if(player.loc.y < 0){
    endGame();
  }
}

/**
 * checks collision, draws, and manages all platforms
 */
var random_boolean = false; 

function handlePlatforms() {
  for (var i = platforms.length - 1; i >= 0; i--) {
		// loop through platforms backward
    if (platforms[i].onScreen) {
      //if platform moves call correct update func
      if(platforms[i].moving && !platforms[i].hasSpring && platforms[i] instanceof Platform){
        platforms[i].update(true);
        platforms[i].drawMoving(platforms[i].altitude);
      }
      if(platforms[i].hasSpring){
        //platforms[i].img = gPlatform;
        platforms[i].draw(player.loc.y);
        if(platforms[i].collidesWith(player)){
          player.jump(25);
        }
      }
      //draws regular platform
      // console.log('does not');
      platforms[i].draw(player.loc.y);
      
      
			if (platforms[i] instanceof Doodler)
				platforms[i].update(); // update Doodlers
      if (platforms[i].collidesWith(player)) {
        /* if player collides with a power booster attached to platform
        */
        player.jump(15);
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
      if (random() < 0.95) {
				// 90% chance of platform
        platforms.push(new Platform(x, y, Math.random() > difficulty , Math.random() > difficulty));
        difficulty -= 0.0001;
      } else {
        if (random() < (difficulty - 0.4)) {
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

function generatePlatforms() {
  platforms = [];
  stepSize = Math.floor(canvas.height / 10);
  //for(let i = height; i>= 0; i-= stepSize){
  for(let i=numPlatforms; i>=0; i--){ // 8
    // random_boolean = Math.random() < 0.5;
    //console.log(random_boolean);
    let p = new Platform(getRandomValue(0,canvas.width-60), i*50, Math.random() > difficulty, Math.random() > difficulty + .09);
    p.onScreen = true;
    //y_arr.push(p.altitude);
    platforms.push(p);
    //sort by y length , if the y length between any of them is greater than the jumping distance, generate new platforms...
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
  localStorage.clear();
  
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
  }
}
