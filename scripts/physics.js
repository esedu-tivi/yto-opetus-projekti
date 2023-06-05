document.getElementById('task-dropdown').addEventListener('click', (event) => taskSelector(event))
document.getElementById('t1-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t2-btn').addEventListener('click', (event) => calculator(event))
document.getElementById('t3-btn').addEventListener('click', (event) => calculator(event))

const canvas_div = document.getElementById('canvas_div')
canvas_div.style.backgroundColor = '#A800D9'



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