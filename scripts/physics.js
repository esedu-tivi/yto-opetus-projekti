document.getElementById('task-dropdown').addEventListener('click', event => taskSelector(event))

const canvas_div = document.getElementById('canvas_div')
canvas_div.style.backgroundColor = '#A800D9'

function taskSelector(event){
  event.preventDefault()
  if(event.target.value === 'null') return

  switch(event.target.value){
    case 'työ':
      document.getElementById('työ').style.display = 'block'
      document.getElementById('nostotyö').style.display = 'none'
      document.getElementById('nostotyö_ja_teho').style.display = 'none'
      break
    case 'nostotyö':
      document.getElementById('työ').style.display = 'none'
      document.getElementById('nostotyö').style.display = 'block'
      document.getElementById('nostotyö_ja_teho').style.display = 'none'
      break
    case 'nostotyö_ja_teho':
      document.getElementById('työ').style.display = 'none'
      document.getElementById('nostotyö').style.display = 'none';
      document.getElementById('nostotyö_ja_teho').style.display = 'block'
      break
  }
}