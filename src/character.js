import * as appraiser from './appraiser.js'

const INPUTS=new Map()
const STACKING=['physical-damage','pierce-damage',
  'bleed-damage','trauma-damage','fire-damage',
  'cold-damage','lightning-damage','acid-damage',
  'vitality-damage','aether-damage','chaos-damage',]

export var properties=false

class Character{
  constructor(){}
  
  get(key){
    let i=INPUTS.get(key)
    if(!i) throw 'unknown input: '+key
    let value=appraiser.parse(i.value)
    if(value===false){
      i.classList.add('error')
      return false
    }
    if(key.indexOf('-modifier')>=0)
      value+=1
    if(STACKING.indexOf(key)>=0){
      let attackrate=this.get('attacks-per-second')
      if(attackrate===false) return false
      value*=attackrate
    }
    return value
  }
}

export var character=new Character()

export function setup(){
  for(let i of document.querySelectorAll('#character input')){
    INPUTS.set(i.id,i)
    i.onkeyup=()=>appraiser.update()
  }
  properties=Array.from(INPUTS.keys())
  properties.sort()
  document.querySelector('button#clear-stats').onclick=()=>{
    for(let i of INPUTS.values()) i.value=''
    appraiser.update()
  }
  
}
