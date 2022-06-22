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

    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
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