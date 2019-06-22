var objs = []
var crashloc
var canvdim = [Math.floor(window.innerWidth / 100) * 100 || Maths.floor(document.body.clientWidth / 100) * 100, window.innerHeight - 25 || document.body.clientHeight - 25] // set canvas resolution

function startGame() {
  objs[0] = new Component(30, 30, 'green', 30, 80)
  objs[1] = new Component(10, 200, 'red', 100, 120)
  objs[2] = new Component(200, 10, 'red', 300, 120)
  objs[3] = new Component(200, 10, 'red', 100, 120)
  objs[4] = new Component(10, 200, 'red', 500, 120)
  objs[5] = new Component(1, canvdim[1], 'black', 0, 0)
  objs[6] = new Component(canvdim[0], 1, 'black', 0, 0)
  objs[7] = new Component(canvdim[0], 1, 'black', 0, canvdim[1] - 1)
  objs[8] = new Component(1, canvdim[1], 'black', canvdim[0] - 1, 0)
  myGameArea.start()
}

var myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.x = 0
    this.canvas.y = 0
    this.canvas.width = canvdim[0]
    this.canvas.height = canvdim[1]
    this.context = this.canvas.getContext('2d')
    document.body.insertBefore(this.canvas, document.body.childNodes[0])
    this.interval = setInterval(updateGameArea, 1)
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || [])
      myGameArea.keys[e.keyCode] = true
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = false
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

function Component(width, height, color, x, y) {
  this.width = width
  this.height = height
  this.speedX = 0
  this.speedY = 0
  this.x = x
  this.y = y
  this.update = function() {
    var ctx
    ctx = myGameArea.context
    ctx.fillStyle = color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
  this.newPos = function() {
    this.x += this.speedX
    this.y += this.speedY
  }
  this.crashWith = function(otherobj) {
    var myleft = this.x
    var myright = this.x + (this.width)
    var mytop = this.y
    var mybottom = this.y + (this.height)
    var otherleft = otherobj.x + 1
    var otherright = otherobj.x + (otherobj.width) - 1
    var othertop = otherobj.y + 1
    var otherbottom = otherobj.y + (otherobj.height) - 1
    var b_collision = otherbottom - objs[0].y
    var t_collision = mybottom - otherobj.y
    var l_collision = myright - otherobj.x
    var r_collision = otherright - objs[0].x
    var crash = true

    if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
      crash = false
    }
    if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision) {
      crashloc = 'top'
    }
    if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision) {
      crashloc = 'bottom'
    }
    if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision) {
      crashloc = 'right'
    }
    if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision) {
      crashloc = 'left'
    }
    return crash
  }
}

function updateGameArea() {
  objs[0].update()
  var moveSpeed = 0.5
  var o
  for (o = 1; o < objs.length; o++) {
    if (objs[0].crashWith(objs[o])) {
      var uncrashSpeed = moveSpeed * (objs.length - 2)
      switch (crashloc) {
        case 'top':
          objs[0].y = objs[0].y - uncrashSpeed
          break
        case 'bottom':
          objs[0].y = objs[0].y + uncrashSpeed
          break
        case 'right':
          objs[0].x = objs[0].x - uncrashSpeed
          break
        case 'left':
          objs[0].x = objs[0].x + uncrashSpeed
          break
      }
    } else {
      myGameArea.clear()
      var i
      for (i = 0; i < objs.length; i++) {
        objs[i].update();
      }
      objs[0].speedX = 0
      objs[0].speedY = 0
      if (myGameArea.keys && myGameArea.keys[37]) {
        objs[0].speedX -= moveSpeed
      }
      if (myGameArea.keys && myGameArea.keys[39]) {
        objs[0].speedX += moveSpeed
      }
      if (myGameArea.keys && myGameArea.keys[38]) {
        objs[0].speedY -= moveSpeed
      }
      if (myGameArea.keys && myGameArea.keys[40]) {
        objs[0].speedY += moveSpeed
      }
      objs[0].newPos()
      //if (myGameArea.keys && myGameArea.keys[32]) {
      //}
    }
  }
}
