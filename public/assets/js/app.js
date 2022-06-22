import Platform from "./platform.js"

var canvas = document.querySelector("#MyCanvas");
var context = canvas.getContext("2d");

var canvasPos = getPosition(canvas);
var mouseX = 0;
var mouseY = 0;


// mouse listener
canvas.addEventListener("mousemove", setMousePosition, false);

function setMousePosition(e) {
    mouseX = e.clientX - canvasPos.x;
    mouseY = e.clientY - canvasPos.y;
}

// draw a diagonal line
context.moveTo(50, 50);
context.lineTo(450, 300);
 
// close the path
context.closePath();
 
// specify what our line looks like
context.lineWidth = 45;
context.strokeStyle = "steelblue";
 
// get the line drawn to the canvas
context.stroke();

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    //enemy creation -- NEW
    const enemy = document.createElement('div')
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = 150
    let enemyLeftSpace = 60
    let enemyBottomSpace = 160
    let isGameOver = false
    let platformCount = 5

    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function createEnemy(){
        grid.appendChild(enemy)
        enemy.classList.add('enemy')
        enemy.style.left = enemyLeftSpace + 'px'
        enemy.style.bottom = enemyBottomSpace + 'px'
    }

    function createPlatforms(){
        for(let i=0; i<platformCount; i++){
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
        }
    }

    function start(){
        if(isGameOver == false){
            createDoodler()
            createPlatforms()
            createEnemy()
        }
    }
    //attach to button
    start()
})