import * as character from './character.js'
import * as appraiser from './appraiser.js'

const ITEM=document.querySelector('template#item').content.children[0]
const CONTAINER=document.querySelector('#items')
const PROPERTY=document.querySelector('template#property').content.children[0]
const POPULATE=true

export var items=[]
var properties=['','multiply','divide']

class Property{
  constructor(item){
    this.item=item
    item.properties.push(this)
    this.view=PROPERTY.cloneNode(true)
    let value=this.view.querySelector('.value')
    value.onkeyup=()=>appraiser.update()
    this.view.querySelector('.priority').onchange=()=>appraiser.update()
    let s=this.view.querySelector('select')
    s.onchange=()=>appraiser.update()
    for(let p of properties){
      let o=document.createElement("option")
      o.value=p
      while(p.indexOf('-')>=0) p=p.replace('-',' ')
      o.text=p
      s.add(o)
    }
    this.view.querySelector('.remove-property').onclick=()=>this.remove()
    item.view.querySelector('.properties').appendChild(this.view)
    appraiser.update()
    value.focus()
  }
  
  remove(){
    let i=this.item.properties.indexOf(this)
    this.item.properties.splice(i,1)
    this.view.remove()
    appraiser.update()
  }
  
  calculate(){
    let value=appraiser.parse(this.view.querySelector('.value').value)
    if(value===false) return false
    let type=this.view.querySelector('.type').value
    let priority=this.view.querySelector('.priority').checked?2:1
    //console.log(type,this.item.score,value,priority)
    if(type=='multiply') this.item.score*=value*priority
    else if(type=='divide') this.item.score/=value*priority
    else{
      type=type==''?1:character.character.get(type)
      if(type===false) return false
      this.item.score+=value*type*priority
    }
    return true
  }
}

class Item{
  constructor(){
    this.properties=[]
    this.score='?'
    items.push(this)
    this.view=ITEM.cloneNode(true)
    this.view.querySelector('button.remove-item').onclick=()=>this.remove()
    this.view.querySelector('button.add-property').onclick=()=>new Property(this)
    CONTAINER.appendChild(this.view)
    this.view.querySelector('.name').focus()
    //new Property(this)
  }
  
  remove(){
    items.splice(items.indexOf(this),1)
    this.view.remove()
  }
  
  update(){
    this.score=0
    for(let p of this.properties) 
      if(!p.calculate()){
        this.score=false
        break
      }
    let score=this.view.querySelector('.score .value')
    score.innerHTML=this.score===false?'?':
      Intl.NumberFormat().format(Math.round(this.score))
  }
}

export function setup(){
  document.querySelector('button#new-item').onclick=()=>new Item()
  properties.push(...character.properties)
  if(POPULATE) new Item()
}

export function update(){for(let i of items) i.update()}
