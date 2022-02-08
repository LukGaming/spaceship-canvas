const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = document.body.clientHeight
const socket = io('http://localhost:3000', { transports: ['websocket'] })
socket.on('updatePosition', e => {
  nave.position.x = e.x
  nave.position.y = e.y
})
class Nave {
  constructor () {
    this.clicks = 0
    this.moving = false
    this.pode_mexer = false
    this.limitRight = canvas.width - canvas.width / 10
    this.limitLeft = (canvas.width - canvas.width / 10) / 10
    this.limitUp = canvas.height / 20
    this.limitDown = canvas.height - canvas.height / 10
    this.position = {
      x: this.limitLeft,
      y: this.limitDown
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    const image = new Image()
    image.src = './ship.png'
    this.image = image
    this.width = 50
    this.heigth = 75
    this.speed = 50
  }
  draw () {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width * 0.75,
      this.heigth * 0.75
    )
  }
  moveRight () {
    this.position.x += this.speed
  }
  moveLeft () {
    this.position.x -= this.speed
  }
  moveUp () {
    this.position.y -= this.speed
  }
  moveDown () {
    this.position.y += this.speed
  }
  updatePosition () {
    var position = {
      x: this.position.x,
      y: this.position.y
    }
    socket.emit('movendoMouse', position)
  }
  moveBymouse (e) {
    if (
      nave.pode_mexer &&
      nave.position.x >= nave.limitLeft &&
      nave.position.x < nave.limitRight &&
      e.clientY >= nave.limitUp &&
      e.clientY < nave.limitDown
    ) {
      nave.position.x = e.clientX
      nave.position.y = e.clientY
      nave.updatePosition()
    }
  }
  stopMoving (e) {
    nave.moving = false
  }
}
const nave = new Nave()
  nave.draw()


window.addEventListener('keydown', teclaPressionada)
function teclaPressionada (event) {
  verify_if_is_inside_repair()
  if (this.event.code == 'ArrowRight') {
    if (nave.position.x < nave.limitRight) {

      nave.moveRight()
      nave.updatePosition()
    }
  }
  if (this.event.code == 'ArrowLeft') {
    if (nave.position.x > nave.limitLeft) {
      nave.moveLeft()
      nave.updatePosition()
    }
  }
  if (this.event.code == 'ArrowUp') {
    if (nave.limitUp < nave.position.y) {
      nave.moveUp()
      nave.updatePosition()
    }
  }
  if (this.event.code == 'ArrowDown') {
    if (nave.position.y < nave.limitDown) {
      nave.moveDown()
      nave.updatePosition()
    }
  }
}
window.addEventListener('click', moverMouse)

canvas.addEventListener('mouseenter', () => {
  if (nave.pode_mexer) {
    canvas.addEventListener('mousemove', e => {

      if (nave.pode_mexer && e.clientX >= nave.limitLeft && e.clientX < nave.limitRight) {
        if (e.clientY >= nave.limitUp && e.clientY < nave.limitDown) {
          nave.position.x = e.clientX
          nave.position.y = e.clientY
        }
      }
    })
  }
})

function moverMouse (e) {
  nave.clicks++

  var pode_mexer = nave.clicks % 2 != 0
  nave.pode_mexer = pode_mexer
  if (nave.clicks >= 1) {
    if (e.clientX >= nave.position.x && e.clientX < nave.position.x + 50) {
      if (e.clientY >= nave.position.y && e.clientY < nave.position.y + 75) {
        window.addEventListener('mousemove', e => {
          console.log('movendo canvas')
          nave.moving = true
          nave.moveBymouse(e)
          window.addEventListener('click', e => {
          })
        })
      }
    }
  }
}
function animate () {
  requestAnimationFrame(animate)

  nave.draw()
  verify_if_is_inside_repair()
}

function verify_if_is_inside_repair () {
  var button = document.getElementsByTagName('button')[0]
  if (nave.position.x > 300 && nave.position.y < 50) {
    button.disabled = false
  } else {
    button.disabled = true
  }
}
animate()
