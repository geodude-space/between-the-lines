var gameBoard
var ctx

var scale
var score

var drawTimer
var roadTimer
var levelTimer
var startSpeed

var levelIndex
var hasLeveled
var levels

var user
var leftBumpers = []
var rightBumpers = []
var debug = false

function levelChange() {
  // rotate levels
  if(levels[level] != levels[levels.length-1]) {
    level++
  } else {
    levels.reverse()
    level = 1
  }

  // could move this to drive() above chooseDirection()
  // adjust leading bumpers for new level
  if(levels[0] == 1) { // level up
    leftBumpers.x[0] += 10
    rightBumpers.x[0] -= 10

  } else { // level down
    leftBumpers.x[0] -= 10
    rightBumpers.x[0] += 10

  }
  hasLeveled = true
}

function drive() {
  var tempL1 = leftBumpers.x[0]
  var tempR1 = rightBumpers.x[0]

  // don't change directions when the level is changing
  if (!hasLeveled) {
    let direction = chooseDirection(leftBumpers.x[0], rightBumpers.x[0])
    leftBumpers.x[0] += scale*direction
    rightBumpers.x[0] += scale*direction
  } else {
    hasLeveled = false
  }

  // update the positions of the rest of the road
  for(i=1; i < leftBumpers.x.length; i++) {
    tempL2 = leftBumpers.x[i]
    tempR2 = rightBumpers.x[i]
    leftBumpers.x[i] = tempL1
    rightBumpers.x[i] = tempR1
    tempL1 = tempL2
    tempR1 = tempR2
  }

  // right now it's 1 point per board movement
  score ++

  // speed up board to increase game difficulty
  if(score % 10 == 0 && startSpeed > 0) {
    startSpeed -= 15
    clearInterval(roadTimer)
    roadTimer=setInterval(drive, startSpeed)
  }
}

function crashed() {
  let left = leftBumpers.x[leftBumpers.x.length-1]
  let right = rightBumpers.x[rightBumpers.x.length-1]

  // check if user hit left bumper
  if(user.x <= left+10) {
    return true

  // check if user hit right bumper
} else if(user.x >= right-8) {
    return true

  }
  return false
}

function keyPress(e){
  // arrow left
  if(e.keyCode == 37){
    user.x-=10
  }
  // arrow right
  else if(e.keyCode == 39){
    user.x+=10
  }
}

function touchPress(e) {
  // move left/right depending on what half of the screen was tapped
  // double tap zoom was disables in the css
  e.preventDefault()
  let touchX = e.touches[0].clientX
  if(touchX < window.innerWidth/2) {
    user.x -= 10
  } else {
    user.x += 10
  }
}

function init() {
  window.addEventListener("keydown", keyPress, false)
  window.addEventListener("touchstart", touchPress, false)

  let height =  window.innerHeight - 20
  let width = window.innerWidth
  if(height > 800) {
    height = 800
  }
  if(width > 375) {
    width = 375
  }
  let centerScreen = parseInt(width/2)

  score = 0
  level = 0
  levels = [1,2,3,4,5,6]

  gameBoard = document.getElementById('gameBoard')

  const pixelRatio = window.devicePixelRatio || 1;

  gameBoard.width = width * pixelRatio;
  gameBoard.height = height * pixelRatio;

  gameBoard.style.width = `${width}px`;
  gameBoard.style.height = `${height}px`;

  ctx = gameBoard.getContext('2d')
  ctx.mozImageSmoothingEnabled = false;  // firefox
  ctx.imageSmoothingEnabled = false;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.fillStyle = 'black';
  ctx.font = '48px Ubuntu'


  user = new User('*',  centerScreen, height)

  scale = height/28  //parseInt(ctx.measureText('^').width)
  leftBumpers = new Bumpers('^', centerScreen-90, height, scale)
  rightBumpers = new Bumpers('^', centerScreen+90, height, scale)

  startSpeed = 500
  drawTimer=setInterval(draw, 10)
  roadTimer=setInterval(drive, startSpeed)
  levelTimer=setInterval(levelChange, 2000)
}

function draw() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height)

    // background color
    // ctx.fillStyle = '#849684'
    // ctx.fillRect(0, 0, gameBoard.width, gameBoard.height)
    // ctx.fillStyle = 'black'

    // bumpers
    for(i=0; i < leftBumpers.x.length; i++) {
      if(debug && (i==0 || i==leftBumpers.x.length-1)){ctx.fillStyle = '#849684'}
      ctx.fillText(leftBumpers.char, leftBumpers.x[i], leftBumpers.y[i])
      ctx.fillText(rightBumpers.char, rightBumpers.x[i], rightBumpers.y[i])
      if(debug) {ctx.fillStyle = 'black'}
      // ctx.addHitRegion({id: "bumpers"});
    }

    // user
    ctx.font = '36px Ubuntu'
    ctx.fillText(user.char,user.x,user.y)
    ctx.font = '48px Ubuntu'

    // scoreboard
    ctx.font = 'bold 12px Ubuntu'
    ctx.fillText(score, 20, 20)
    ctx.font = '48px Ubuntu'

    if(crashed()) {
      // write score to file? will someone hack this?
      alert("Game Over")
      clearInterval(drawTimer)
      clearInterval(roadTimer)
      clearInterval(levelTimer)
      init()
    }
}

// Todo:
// more tuning to keep bumpers off walls
// shorter height interval so the game looks smoother
// fix user left/right change latency
