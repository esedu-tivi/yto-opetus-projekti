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
    position: { x: 160, y: 200 },
    defaultPosition: { x: 160, y: 200 },
    width: 150,
    height: 300
  },
  character: {
    position: { x: -275, y: 70 },
    defaultPosition: {x: -275, y: 70},
    scale: 0.9
  },
  stairs: {
    position: { x: 85, y: 150 },
    defaultPosition: { x: 85, y: 150 },
    width:  9,
    height: 6,
    steps: 30
  }
}

let settings = {}

let frame = 0
let speed = 4
let active
let disabled = false
let started = false


//Loading canvas and sprites
window.onload = function() {
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')

  let canvas_div = document.getElementById('canvas_div')
  console.log(canvas_div)

  canvas.width = canvas_div.offsetWidth
  canvas.height = canvas_div.offsetHeight

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
    document.getElementById('start').disabled = true
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

  if(t1_strength < 100 || t1_strength > 1000) return parameterError('Voiman on oltava 100-1000N välillä')
  if(t1_distance < 10 || t1_distance > 25) return parameterError('Matkan on oltava 10-25m välillä')

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
    task1: [t1_result_work],
    task2: [t2_result_weight, t2_result_lift],
    task3: [t3_result_weight, t3_result_lift, t3_result_efficiency]
  }

  values[active].forEach(value => {
    if(isNaN(value.value)) return parameterError('Syötä määreet numeroina')
  })

  document.getElementById('start').disabled = false

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
  context.clearRect(0, 0, canvas.width, canvas.height)
}


//Draws an arrow
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
function draw() {
  if(!active || disabled) return
  
 

  //Drawing of task 1 - pushing a closet
  if(active === 'task1') {
    objects.box.position.x += speed
    objects.character.position.x += speed

    if(objects.box.position.x > settings.task1.distance * 47 - 100) return
    
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(sprite.imageWalking, frame * sprite.width, 0, sprite.width, sprite.height, objects.character.position.x, objects.character.position.y, sprite.width * objects.character.scale, sprite.height * objects.character.scale)

    drawArrow(objects.character.defaultPosition.x + 310, 520, settings.task1.distance * 47, 15, true)
    drawArrow(objects.character.position.x + 90, 280, 150, settings.task1.strength / 10, true)

    context.font = "bold 48px Arial"
    context.fillText(`${settings.task1.distance}m`, objects.character.defaultPosition.x + 310 + settings.task1.distance * 47 / 2, 580)
    context.fillText(`${settings.task1.strength}N`, objects.character.position.x + 90, 280 - settings.task1.strength / 14)

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
