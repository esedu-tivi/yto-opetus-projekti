document.getElementById('task-dropdown').addEventListener('click', (event) => taskSelector(event))
document.getElementById('t1-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t2-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t3-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('start').addEventListener('click', playAnimation)
document.getElementById('stop').addEventListener('click', stopAnimation)
document.getElementById('reset').addEventListener('click', resetAnimation)


let canvas
let context

const sprite = {
  width: 800,
  height: 600
}

let objects = {
  box: {
    position: { x: 100, y: 30 },
    defaultPosition: { x: 100, y: 30 },
    width: 30,
    height: 65
  },
  character: {
    position: { x: 0, y: 0 },
    defaultPosition: {x: 0, y: 0},
    scale: 0.2
  },
  stairs: {
    position: { x: 85, y: 100 },
    defaultPosition: { x: 85, y: 100 },
    width: 10,
    height: 6,
    steps: 16
  }
}

let settings = {
  task1: {
    strength: 0,
    distance: 0,
    work: 0
  }
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
  
  if(event.target.value !== active) {
    resetAnimation()
    disabled = true
    context.clearRect(0, 0, canvas.width, canvas.height)
    document.getElementById('start').disabled = false
    document.getElementById('stop').disabled = true
    document.getElementById('reset').disabled = true
    document.getElementById('parameter-error').innerHTML = ''
  }

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
  let t1_strength = Number(document.getElementById('t1-strength').value)
  let t1_distance = Number(document.getElementById('t1-distance').value)
  let t1_result_work = document.getElementById('t1-result-work')
  t1_result_work.value = t1_strength * t1_distance
  settings.task1 = {strength: t1_strength, distance: t1_distance, work: t1_result_work}

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
function playAnimation() {
  if(!active) return
  disabled = false

  document.getElementById('start').disabled = true
  document.getElementById('stop').disabled = false
  document.getElementById('reset').disabled = false

  if(started) return draw()
  started = true

  setInterval(() => {
    draw()
  }, 50)
}



//Stops the animation
function stopAnimation() {
  if(!active) return
  disabled = true
  document.getElementById('start').disabled = false
  document.getElementById('stop').disabled = true
}



//Resets the animation
function resetAnimation() {
  objects.box.position = {...objects.box.defaultPosition}
  objects.character.position = {...objects.character.defaultPosition}
  draw(true)
}

function drawArrow(x, y, length, width, vertical) {
  context.beginPath()
  context.moveTo(x, y)

  if(vertical) {
    context.lineTo(x + length, y)
  } else {
    context.lineTo(x, y + length)
  }
  
  context.lineWidth = width
  context.stroke()

  context.beginPath()

  if(vertical) {
    context.moveTo(x + length, y + width)
    context.lineTo(x + length + width, y)
    context.lineTo(x + length, y - width)
  } else {
    context.moveTo(x - width, y + length)
    context.lineTo(x, y + length + width)
    context.lineTo(x + width, y + length)
  }

  context.fill()
  return
}


//Draws the animation
function draw(bypass) {
  if(!bypass) {
    if(!active || disabled) return
  }
 

  //Drawing of task 1 - pushing a closet
  if(active === 'task1') {
    objects.box.position.x += speed
    objects.character.position.x += speed

    if(objects.box.position.x > canvas.width){
      objects.box.position.x = 100
      objects.character.position.x = 0
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(sprite.imageWalking, frame * sprite.width, 0, sprite.width, sprite.height, objects.character.position.x, objects.character.position.y, sprite.width * objects.character.scale, sprite.height * objects.character.scale)

    drawArrow(objects.character.defaultPosition.x + 70, 110, settings.task1.distance, 6, true)

    context.beginPath()
    context.fillRect(objects.box.position.x, objects.box.position.y, objects.box.width, objects.box.height)
    context.stroke()

    if(frame < 14) frame++
    else frame = 0 
  }



  //Drawing of task 2 - lifting up a backpack
  if(active === 'task2') {

  }



  //Drawing of task 3 - climbing up the stairs
  if(active === 'task3') {

    context.clearRect(0, 0, canvas.width, canvas.height)

    //Drawing the character
    context.drawImage(sprite.imageStairs, frame * sprite.width, 0, sprite.width, sprite.height, objects.character.position.x, objects.character.position.y, sprite.width * objects.character.scale, sprite.height * objects.character.scale)


    //Drawing the stairs according to the number of steps
    context.beginPath()
    context.moveTo(objects.stairs.position.x, objects.stairs.position.y)

    for(let i = 0; i < objects.stairs.steps; i++) {
      if(i % 2 === 1) {
        context.lineTo(objects.stairs.position.x, objects.stairs.position.y)
        objects.stairs.position.x += objects.stairs.width
      } else {
        context.lineTo(objects.stairs.position.x, objects.stairs.position.y)
        objects.stairs.position.y -= objects.stairs.height
      }
      if(i === objects.stairs.steps - 1) objects.stairs.position = {...objects.stairs.defaultPosition}
      context.stroke()
    }

    //Moving character up the stairs on the correct frames
    if(frame > 7) {
      objects.character.position.x += 1.5
      objects.character.position.y -= 1
    }
    
    if(frame < 12) frame++
    else frame = 0
  }
}
