document.getElementById('task-dropdown').addEventListener('click', (event) => taskSelector(event))
document.getElementById('t1-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t2-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t3-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('start').addEventListener('click', (event) => playAnimation(event))


//Handles the task parameter form
function taskSelector(event) {
  event.preventDefault()

  if(event.target.value === 'null') return

  let tasks = ['task1', 'task2', 'task3']

  tasks.forEach(task => {
    if(task === event.target.value) {
      document.getElementById(task).style.display = 'block'
    } else {
      document.getElementById(task).style.display = 'none'
    }
  })
}


//Calculates the physical quantities according to user's inputs
function calculator(event) {
  event.preventDefault()

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

}



const sprite = {
  width: 630,
  height: 471
}

let box = {
  position:{
      x: 130,
      y: 20
  },
  width: 30,
  height: 30
}

let character = {
  position: {
      x: 50,
      y: -30
  },
  scale: 0.2
}

let frame = 0
let speed = 4

let canvas
let context

window.onload = function() {
  canvas = document.getElementById("canvas")
  context = canvas.getContext("2d")

  sprite.image = new Image()
  sprite.image.src = "../images/sprite.png"

  requestAnimationFrame(update)
}

function playAnimation(event) {
  event.preventDefault()
  setInterval(() => {
    update()
  }, 50)
}

function update() {
  box.position.x += speed
  character.position.x += speed

  if(box.position.x > canvas.width){
      box.position.x = 130
      character.position.x = -30
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(sprite.image, frame * sprite.width, 0, sprite.width, sprite.height, character.position.x, character.position.y, sprite.width * character.scale, sprite.height * character.scale)

  context.beginPath()
  context.fillRect(box.position.x, box.position.y, box.width, box.height)
  context.stroke()

  if(frame < 6) frame++
  else frame = 0
}