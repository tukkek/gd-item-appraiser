import * as character from './character.js'
import * as item from './item.js'

export function update(){
  for(let e of document.querySelectorAll('.error'))
    e.classList.remove('error')
  item.update()
  character.update()
}

export function setup(){
  character.setup()
  item.setup()
  update()
}

export function parse(value){
  if(!value) return false
  value=value.trim()
  if(value.length==0) return false
  if(value.indexOf('-')>=0){
    value=value.split('-')
    if(value.length!=2) return false
    value=Number(value[0])+Number(value[1])
    return value/2
  }
  if(value.indexOf('%')>=0)
    return Number(value.split('%')[0])/100
  return Number(value)
}
