let canvas = document.getElementById("mainCanvas")
let context = canvas.getContext('2d')
let paddleLeft
let paddleRight
let ball
let interval
let scoreInterval
let started
let Rscore = 0
let Lscore = 0

function setup() {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    paddleLeft = new paddle(40,canvas.height/2,false);
    paddleRight = new paddle(canvas.width - 80,canvas.height/2,false);
    ball = new puck()
    interval = setInterval(updateGame, 20);
    scoreInterval = setInterval(Score.update, 20)
    ball.start()
    started = true
}

let Score = {
    update : function() {
        this.ctx = context
        ctx.clearRect((canvas.width/2)-50,0,(canvas.width/2)+50,50)
        this.ctx.fillStyle = '#ffffff'
        this.ctx.font = '30px Verdanda'
        this.ctx.fillText(Lscore + ' | ' + Rscore,canvas.width/2-50,50)
    }
}

function updateGame() {
    paddleLeft.update()
    paddleRight.update()
    ball.update()
    console.log('update')
    controlCheck()
}

function controlCheck() {
    document.addEventListener("keypress", function onEvent(event) {
        switch(event.key) {
            case 'w':
            paddleRight.velocityy = -3
            break
            case 's':
            paddleRight.velocityy = 3
            break
            case 'Enter':
            reset()
            break
        }
    })
    document.addEventListener('keyup', function onEvent(event) {
        paddleRight.velocityy = 0
    })
}

function reset() {
    paddleLeft.positiony = (canvas.height/2) - (paddleLeft.height/2)
    paddleRight.positiony = (canvas.height/2) - (paddleRight.height/2)
    ball.positionx = (canvas.width/2) - (ball.width/2)
    ball.positiony = (canvas.height/2) - (ball.height/2)
    context.clearRect(0,0,canvas.width,canvas.height)
    if (started == false) {
        interval = setInterval(updateGame, 20);
        started = true
    }
    ball.start()
}


class paddle {
    constructor(x,y,isPlayer) {
        this.positionx = x - 10
        this.positiony = y - 90
        this.velocityx = 0
        this.velocityy = 0
        this.ctx = context
        this.width = 20
        this.height = 180
        this.prevX
        this.prevY
        this.player = isPlayer

    }

    update() {
        this.prevX = this.positionx
        this.prevY = this.positiony
        if (this.positiony < 0) {
            this.positiony = 0
        } else if (this.positiony + this.height > canvas.height) {
            this.positiony = canvas.height - this.height
        }
        this.positionx += this.velocityx
        this.positiony += this.velocityy
        this.clear()
        this.ctx.fillStyle = "#ffffff"
        this.ctx.fillRect(this.positionx,this.positiony, this.width, this.height)
        if (this.player == false){
            this.move()
        }
    }
    
    clear() {
        this.ctx.clearRect(this.prevX-1,this.prevY-1,this.width + 2,this.height + 2)
    }

    move() {
        if (this.positionx > canvas.width/2) {
            if (ball.positionx > canvas.width/2) {
                if (ball.positiony - 40 < this.positiony) {
                    this.velocityy = -3
                } else if ((ball.positiony + ball.height) + 40 > (this.positiony + this.height)) {
                    this.velocityy = 3
                } else {
                    this.velocityy = 0
                }
            }
        } else {
            if (ball.positionx < canvas.width/2) {
                if (ball.positiony - 40 < this.positiony) {
                    this.velocityy = -3
                } else if ((ball.positiony + ball.height) + 40 > (this.positiony + this.height)) {
                    this.velocityy = 3
                } else {
                    this.velocityy = 0
                }
            }
        }
    }
}

class puck {
    constructor() {
        this.positionx = (canvas.width / 2) - 10
        this.positiony = (canvas.height   / 2) - 10
        this.velocityx = 0
        this.velocityy = 0
        this.ctx = context
        this.width = 20
        this.height = 20
        this.prevX = 0
        this.prevY = 0
        this.justCollided = false
    }

    update() {
        this.prevX = this.positionx
        this.prevY = this.positiony
        this.positionx += this.velocityx
        this.positiony += this.velocityy   
        this.collide() 
        this.clear()
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(this.positionx,this.positiony,this.width,this.height)
    }

    clear() {
        this.ctx.clearRect(this.prevX-1,this.prevY-1,this.width+2,this.height+2)
    }
    
    collide() {
        if (this.positionx + this.width > paddleRight.positionx & this.positiony + this.height > paddleRight.positiony & this.positiony < paddleRight.positiony + paddleRight.height) {
            this.velocityx = (Math.floor(Math.random() * 3) + 3) * -1
            this.velocityy *= 1.2
        } else if (this.positionx < paddleLeft.positionx + paddleLeft.width & this.positiony + this.height > paddleLeft.positiony & this.positiony < paddleLeft.positiony + paddleLeft.height) {
            this.velocityx = Math.floor(Math.random() * 3) + 3
            this.velocityy *= 1.2
        }
        if (this.positiony + this.height > canvas.height) {
            this.velocityy = (Math.floor(Math.random() * 2) +1) * -1
        } else if (this.positiony < 0) {
            this.velocityy = Math.floor(Math.random() * 2) +1
        }
        if (this.positionx < (paddleLeft.positionx + paddleLeft.width) - 10) {
            started = false
            Rscore += 1
            setTimeout(function(){ clearInterval(interval); }, 1)
            setTimeout(function(){reset();}, 500)
        }
        if (this.positionx + this.width > paddleRight.positionx + 10) {
            started = false
            Lscore += 1
            setTimeout(function(){ clearInterval(interval); }, 1)
            setTimeout(function(){reset();}, 500)
        }
    }
    start() {
        this.velocityx = Math.floor(Math.random() * 2) + 2
        this.velocityy = 2
    }
}

