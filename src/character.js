import * as appraiser from './appraiser.js'

const INPUTS=new Map()
const STACKING=['physical-damage','pierce-damage',
  'bleed-damage','trauma-damage','fire-damage',
  'cold-damage','lightning-damage','acid-damage',
  'vitality-damage','aether-damage','chaos-damage',
]

export var properties=['armor-head','armor-shoulders',
  'armor-chest','armor-arms','armor-legs','armor-feet',
  'armor-other','retaliation-all',
  'offensive-ability-to-dps','defensive-ability-to-health',
  'offensive-ability-%-to-dps','defensive-ability-%-to-health',
  'crit-chance-%-to-dps','elemental-modifier',
  'elemental-damage',
]

function clean(name){
  while(name.indexOf('-')>=0)
    name=name.replace('-','')
  return name.replace('%','p')
}

class Character{
  constructor(){}
  
  get armorhead(){return .15}
  get armorshoulders(){return .15}
  get armorchest(){return .26}
  get armorarms(){return .12}
  get armorlegs(){return .20}
  get armorfeet(){return .12}
  get armorother(){return 1}
  
  get retaliationall(){
    let all=Array.from(INPUTS.keys())
    all=all.filter(k=>k.indexOf('-retaliation')>=0)
    let sum=0
    for(let r of all){
      let value=this.get(r)
      if(value) sum+=value
    }
    return sum
  }
  
  get offensiveabilitytodps(){
    let dps=this.get('damage-per-second')
    return dps&&dps/(100*30)
  }
  
  get offensiveabilityptodps(){
    let oa=this.get('offensive-ability')
    let oadps=this.offensiveabilitytodps
    return oa&&oadps&&oa*oadps/100
  }
  
  get defensiveabilitytohealth(){
    let h=this.get('health')
    return h&&h/(100*30)
  }
  
  get defensiveabilityptohealth(){
    let da=this.get('defensive-ability')
    let dahp=this.defensiveabilitytohealth
    return da&&dahp&&da*dahp/100
  }
  
  get critchanceptodps(){
    let cc=this.get('crit-chance')
    let dps=this.get('damage-per-second')
    return cc&&dps&&cc*dps/100
  }
  
  get elementalmodifier(){
    let f=this.get('fire-modifier')
    let c=this.get('cold-modifier')
    let l=this.get('lightning-modifier')
    return f&&c&&l&&(f+c+l)/3
  }
  
  get elementaldamage(){
    let f=this.get('fire-damage')
    let c=this.get('cold-damage')
    let l=this.get('lightning-damage')
    return f&&c&&l&&f+c+l
  }
  
  get(key){
    let computed=this[clean(key)]
    if(computed!==undefined) return computed
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
  properties.push(...Array.from(INPUTS.keys()))
  properties.sort()
  document.querySelector('button#clear-stats').onclick=()=>{
    for(let i of INPUTS.values()) i.value=''
    appraiser.update()
  }
}
