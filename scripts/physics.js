document.getElementById('task-dropdown').addEventListener('click', (event) => taskSelector(event))
document.getElementById('t1-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t2-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t3-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('start').addEventListener('click', (event) => playAnimation(event))
document.getElementById('stop').addEventListener('click', (event) => stopAnimation(event))

let canvas
let context

const sprite = {
  width: 800,
  height: 600
}

let box = {
  position: { x: 100, y: 30 },
  width: 30,
  height: 65
}

let character = {
  position: { x: 0, y: 0 },
  scale: 0.2
}

let frame = 0
let speed = 1
let active
let disabled = false
let started = false


//Loading canvas and sprites
window.onload = function() {
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')

  sprite.imageWalking = new Image()
  sprite.imageWalking.src = '../images/sprite_walk.png'

  sprite.imageStairs = new Image()
  sprite.imageStairs.src = '../images/sprite_stairs.png'

  requestAnimationFrame(draw)
}



//Handles the task parameter form
function taskSelector(event) {
  event.preventDefault()
  if(event.target.value === 'null') return

  let tasks = ['task1', 'task2', 'task3']
  active = null

  tasks.forEach(task => {
    if(task === event.target.value) {
      document.getElementById(task).style.display = 'block'
      active = task
    } else {
      document.getElementById(task).style.display = 'none'
    }
  })
}



//Calculates the physical quantities according to user's inputs
function calculator(event) {
  event.preventDefault()
  document.getElementById('parameter-error').innerHTML = ''

  //Task 1 parameters
  let t1_strength = document.getElementById('t1-strength').value
  let t1_distance = document.getElementById('t1-distance').value
  let t1_result = document.getElementById('t1-result-work')
  t1_result.value = Number(t1_strength) * Number(t1_distance)

  //Task 2 parameters
  let t2_mass = document.getElementById('t2-mass').value
  let t2_height = document.getElementById('t2-height').value
  let t2_result_weight = document.getElementById('t2-result-weight')
  let t2_result_lift = document.getElementById('t2-result-lift')
  t2_result_weight.value = Number(t2_mass) * 10
  t2_result_lift.value = (Number(t2_mass) * 10) * Number(t2_height)
   
  //Task 3 parameters
  let t3_mass = document.getElementById('t3-mass').value
  let t3_height = document.getElementById('t3-height').value
  let t3_time = document.getElementById('t3-time').value
  let t3_result_weight = document.getElementById('t3-result-weight')
  let t3_result_lift = document.getElementById('t3-result-lift')
  let t3_result_efficiency = document.getElementById('t3-result-efficiency')
  t3_result_weight.value = Number(t3_mass) * 10
  t3_result_lift.value =  t3_result_weight.value * Number(t3_height)
  t3_result_efficiency.value = t3_result_lift.value / Number(t3_time)


  //Parameter error handling
  let values = {
    task1: [t1_result],
    task2: [t2_result_weight, t2_result_lift],
    task3: [t3_result_weight, t3_result_lift, t3_result_efficiency]
  }

  values[active].forEach(value => {
    if(isNaN(value.value)) return parameterError('Syötä määreet numeroina')
  })

}


//Error handler for parameters
function parameterError(text) {
  let error_div = document.getElementById('parameter-error')
  error_div.innerHTML = text
  setTimeout(() => {
    error_div.innerHTML = ''
  }, 5000)
}



//Starts the animation
function playAnimation(event) {
  event.preventDefault()
  if(!active) return
  disabled = false
  if(started) return draw()
  started = true

  setInterval(() => {
    draw()
  }, 50)
}



//Stops the animation
function stopAnimation(event) {
  event.preventDefault()
  if(!active) return
    disabled = true
}



//Draws the animation
function draw() {
  if(!active || disabled) return

  if(active === 'task1') {
    box.position.x += speed
    character.position.x += speed

    if(box.position.x > canvas.width){
      box.position.x = 100
      character.position.x = 0
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(sprite.imageWalking, frame * sprite.width, 0, sprite.width, sprite.height, character.position.x, character.position.y, sprite.width * character.scale, sprite.height * character.scale)

    context.beginPath()
    context.fillRect(box.position.x, box.position.y, box.width, box.height)
    context.stroke()

    if(frame < 14) frame++
    else frame = 0 
  }

  if(active === 'task2') {

  }

  if(active === 'task3') {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(sprite.imageStairs, frame * sprite.width, 0, sprite.width, sprite.height, character.position.x, character.position.y, sprite.width * character.scale, sprite.height * character.scale)
    if(frame < 20) frame++
    else frame = 0 
  }

}
