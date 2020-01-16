function Bumpers(char, x, y, scale) {
  this.char = char
  this.x = []
  this.y = []

  for(i=0; i < scale; i++) {
    this.x[i] = x
    this.y[i] = 20+i*scale
  }
}

function anyDirection(bumper) {
  return Math.floor(Math.random() * 3) - 1
}

function sameOrRight() {
  return Math.floor(Math.random() * 2)
}

function sameOrLeft() {
  return Math.floor(Math.random() * 1) - 1
}

function chooseDirection(leftX, rightX) {
  // right bumper can't touch left border
  if(rightX >= 440) {
    return -1
    // return sameOrLeft() // might need to be just left

    // left bumper can't touch right border
  } else if(leftX <= 20) {
    return sameOrRight()

  } else {
    return anyDirection()
  }
}
