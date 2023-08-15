document.getElementById('task-dropdown').addEventListener('click', (event) => taskSelector(event))
document.getElementById('t1-btn').addEventListener('click', (event) => calculator1(event))
document.getElementById('t2-btn').addEventListener('click', (event) => calculator2(event))
document.getElementById('t3-btn').addEventListener('click', (event) => calculator3(event))
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
    position: { x: 138, y: 500 },
    defaultPosition: { x: 138, y: 500 },
    finalPosition: {x: 0, y: 0},
    width:  20,
    height: 20,
    steps: 30
  },
  newtonArrow: {
    position: { x: 85, y: 280 },
    defaultPosition: { x: 85, y: 280 },
    scale: 1
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

  resetAnimation()

  //Setting the width of the canvas to equal the parent div of the actual canvas
  let canvas_div = document.getElementById('canvas_div')
  canvas.width = canvas_div.offsetWidth
  canvas.height = canvas_div.offsetHeight

  //Setting the newton arrow to begin at the start of the canvas no matter the resolution
  objects.newtonArrow.position.x = canvas.width * 0.02 - 200
  objects.newtonArrow.defaultPosition = {...objects.newtonArrow.position}

  context.font = "bold 48px Arial"
  
  //Scaling down the objects and correcting their positions if the canvas is small, e.g mobile resolutions
  if(canvas.width < 400) {
    speed = 2
    objects.character.scale = 0.5
    objects.character.position = {y: 275, x: -170}
    objects.character.defaultPosition = {...objects.character.position}
    objects.box.position = {x: 70, y: 360}
    objects.box.defaultPosition = {...objects.box.position}
    objects.box.height = 150
    objects.newtonArrow.position.y = 380
    objects.newtonArrow.defaultPosition = {...objects.newtonArrow.position}
    objects.newtonArrow.scale = 0.5
  }

  sprite.imageWalking = new Image()
  sprite.imageWalking.src = '../images/sprite_walk.png'

  sprite.imageStairs = new Image()
  sprite.imageStairs.src = '../images/sprite_stairs.png'

  sprite.imageBackpack = new Image()
  sprite.imageBackpack.src = '../images/backpack.png'

  sprite.imageTable = new Image()
  sprite.imageTable.src = '../images/table.png'

  requestAnimationFrame(draw)
}



//Handles the task parameter form
function taskSelector(event) {
  event.preventDefault()

  //Resets the animation & object positions, disables updating, disables buttons and clears errors when a new task is chosen
  if(event.target.value !== active) {
    resetAnimation()
    disabled = true
    context.clearRect(0, 0, canvas.width, canvas.height)
    document.getElementById('start').disabled = true
    document.getElementById('stop').disabled = true
    document.getElementById('reset').disabled = true
    document.getElementById('parameter-error').innerHTML = ''
  }


  //Handles showing/hiding of the correct parameters
  let tasks = ['task1', 'task2', 'task3']

  tasks.forEach(task => {
    if(task === event.target.value) {
      document.getElementById(task).style.display = 'block'
      active = task
      if(settings[active]) document.getElementById('start').disabled = false
    } else {
      document.getElementById(task).style.display = 'none'
    }
  })
}



//Calculates the physical quantities according to user's inputs
function calculator1(event) {
  event.preventDefault()
  document.getElementById('start').disabled = false
  
  //Task 1 parameters
  let t1_strength = Number(document.getElementById('t1-strength').value)
  let t1_distance = Number(document.getElementById('t1-distance').value)
  let t1_result_work = document.getElementById('t1-result-work')

  if(t1_strength < 100 || t1_strength > 1000) return parameterError('Voiman on oltava 100-1000N välillä')
  if(t1_distance < 10 || t1_distance > 25) return parameterError('Matkan on oltava 10-25m välillä')

  t1_result_work.value = t1_strength * t1_distance
  settings.task1 = {strength: t1_strength, distance: t1_distance, work: t1_result_work}
}



function calculator2(event) {
  event.preventDefault()
  document.getElementById('start').disabled = false
  
  //Task 2 parameters
  let t2_mass = document.getElementById('t2-mass').value
  let t2_height = document.getElementById('t2-height').value
  let t2_result_weight = document.getElementById('t2-result-weight')
  let t2_result_lift = document.getElementById('t2-result-lift')

  if(t2_mass < 1 || t2_mass > 50) return parameterError('Massan on oltava 1-50 välillä')
  if(t2_height < 1 || t2_height > 3) return parameterError('Korkeuden on oltava 1-3 välillä')

  t2_result_weight.value = Number(t2_mass) * 9.81
  t2_result_lift.value = (Number(t2_mass) * 9.81) * Number(t2_height)
  settings.task2 = {mass: t2_mass, height: t2_height}
}



function calculator3(event) {
  event.preventDefault()
  document.getElementById('start').disabled = false
  
  //Task 3 parameters
  let t3_mass = document.getElementById('t3-mass').value
  let t3_height = document.getElementById('t3-height').value
  let t3_time = document.getElementById('t3-time').value
  let t3_result_weight = document.getElementById('t3-result-weight')
  let t3_result_lift = document.getElementById('t3-result-lift')
  let t3_result_efficiency = document.getElementById('t3-result-efficiency')

  if(t3_mass < 100 || t3_mass > 200) return parameterError('Massan on oltava 100-200 välillä')
  if(t3_height < 1 || t3_height > 10) return parameterError('Korkeuden on oltava 1-10m välillä')
  if(t3_time < 1 || t3_time > 120) return parameterError('Ajan on oltava 1-120 sekunnin välillä')

  t3_result_weight.value = Number(t3_mass) * 10
  t3_result_lift.value =  t3_result_weight.value * Number(t3_height)
  t3_result_efficiency.value = t3_result_lift.value / Number(t3_time)
  settings.task3 = {mass: t3_mass, height: t3_height, time: t3_time}
  objects.stairs.steps = t3_height * 5
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
  objects.newtonArrow.position = {...objects.newtonArrow.defaultPosition}
  objects.character.animationStarted = false;
  context.clearRect(0, 0, canvas.width, canvas.height)
}


//Draws an arrow
function drawArrow(x, y, length, width, vertical) {

  //Drawing the line
  context.beginPath()
  context.moveTo(x, y)
  
  if(vertical) {
    context.lineTo(x + length, y)
  } else {
    context.lineTo(x, y + length)
  }

  context.lineWidth = width
  context.stroke()

  //Drawing the arrowhead
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

    //Determining the length of the distance arrow with a max limit of 94% of the canvas
    let distanceArrow = settings.task1.distance * canvas.width / 24
    if(distanceArrow > canvas.width) distanceArrow = canvas.width * 0.94

    //Stopping the animation at the end of the distance arrow
    if(objects.box.position.x > distanceArrow - (canvas.width * 0.1)) return

    //Setting the width of the closet to a more suitable number on smaller devices
    if(objects.box.width > canvas.width / 5) objects.box.width = canvas.width / 8
    
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    //Drawing the character
    context.drawImage(sprite.imageWalking, frame * sprite.width, 0, sprite.width, sprite.height, objects.character.position.x, objects.character.position.y, sprite.width * objects.character.scale, sprite.height * objects.character.scale)

    //Drawing the distance and newton arrows
    drawArrow(canvas.width * 0.02, 520, distanceArrow, 15, true)
    drawArrow(objects.newtonArrow.position.x, objects.newtonArrow.position.y, 150, settings.task1.strength / 10 * objects.newtonArrow.scale, true)

    objects.newtonArrow.position.x += speed

    //Texts showing the physical quantities
    context.fillText(`${settings.task1.distance}m`, distanceArrow / 2, 580)
    context.fillText(`${settings.task1.strength}N`, objects.newtonArrow.position.x, objects.newtonArrow.position.y - settings.task1.strength / 14 * objects.newtonArrow.scale)

    //Drawing the closet
    context.beginPath()
    context.fillRect(objects.box.position.x, objects.box.position.y, objects.box.width, objects.box.height)
    context.stroke()

    //Changing the character animation's frames
    if(frame < 14) frame++
    else frame = 0 
  }



// Drawing of task 2 - lifting up a backpack
if (active === 'task2') {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the position of the table based on user input
  const t2_height = Number(settings.task2.height);
  const tableHeight = t2_height * 140; // Adjust multiplier as needed
  const tableWidth = (3 / 4) * tableHeight;
  const tableX = (canvas.width - tableWidth) / 2;
  const tableY = canvas.height - tableHeight;

  // Calculate backpack dimensions and position
  const t2_mass = Number(settings.task2.mass);
  const backpackWidth = 70 + t2_mass * 0.6;
  const backpackHeight = backpackWidth * 1.2;
  const backpackX = tableX + (tableWidth - backpackWidth) / 2; // Center the backpack horizontally

  // Calculate the initial y position of the backpack at the bottom of the table
  const initialBackpackY = tableY + tableHeight - backpackHeight;

  // Initialize the current y position of the backpack
  if (!objects.character.animationStarted) {
    objects.character.position.y = initialBackpackY;
    objects.character.animationStarted = true;
  }

  // Calculate the target y position for the backpack
  const targetBackpackY = tableY - backpackHeight + 5;
  
  // Animate the backpack's y position
  animateBackpack(targetBackpackY);

  // Draw the table at the calculated position and size
  context.drawImage(sprite.imageTable, tableX, tableY, tableWidth, tableHeight);

  // Draw the backpack above the table
  context.drawImage(sprite.imageBackpack, backpackX, objects.character.position.y, backpackWidth, backpackHeight);

  // Update the canvas
  requestAnimationFrame(draw);
}

// Function to animate the backpack rising
function animateBackpack(targetY) {
  const speed = 0.4; // Set a constant speed

  // Calculate the next y position based on the speed
  if (objects.character.position.y > targetY) {
    objects.character.position.y -= speed;
  } else {
    objects.character.position.y = targetY;
  }
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
      if(i === objects.stairs.steps - 1) {
        objects.stairs.finalPosition = {...objects.stairs.position}
        objects.stairs.position = {...objects.stairs.defaultPosition}
      }
      context.stroke()
    }

    //Stopping character on top of the stairs
    if((objects.character.position.y + 432.75) <= objects.stairs.finalPosition.y) return

    //Moving character up the stairs on the correct frames
    if(frame > 7) {
      objects.character.position.x += 2.5
      objects.character.position.y -= 2.5
    }
    
    if(frame < 12) frame++
    else frame = 0
  }
}

window.onresize = window.onload
