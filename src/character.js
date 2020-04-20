import * as appraiser from './appraiser.js'

const inputs=new Map()
export var properties=false

class Character{
  constructor(){}
  
  get(key){
    let i=inputs.get(key)
    if(!i) throw 'unknown input: '+key
    let value=appraiser.parse(i.value)
    if(value) return value
    i.classList.add('error')
    return false
  }
}

export var character=new Character()

export function setup(){
  for(let i of document.querySelectorAll('#character input')){
    inputs.set(i.id,i)
    i.onkeyup=()=>appraiser.update()
  }
  properties=Array.from(inputs.keys())
  properties.sort()
  document.querySelector('button#clear-stats').onclick=()=>{
    for(let i of inputs.values()) i.value=''
    appraiser.update()
  }
}
