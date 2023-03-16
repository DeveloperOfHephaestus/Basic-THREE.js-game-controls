//for all dom events in game  
//creating and exporting dom handlers
import {DOM_Horus} from "./HorusCoreModule.js";  


export class DOM_Manager
{ Elements=[];    //standard structure of obj is ={name,element,Childof}  //must have a name
  DOM=undefined;
  Horuses=[]; //property of advanced DOM creating multiple elements at single line code
  
    constructor(document)
    { //just creating DOM
        this.DOM=document;
    }

  Introduce_Element(Name,HTML_element,ChildOf,Style)
  { let wrapped={Name:Name,element:HTML_element,ChildOf:ChildOf};
    wrapped.element.style=Style;
    this.Elements.push(wrapped);
  }  
  getElementByName(name)
  {  let Found;
    this.Elements.forEach(e=>{
      if(e.Name==name)
      Found=e.element;
    })
   return Found;
  }
  ApplyDOM_Event(nameOfElement,whichEvent,callback)
  { let Found=this.getElementByName(nameOfElement);
    Found.addEventListener(whichEvent,callback);
  }
  RemoveDOM_Event(nameOfElement,Callback_to_Remove){
    let Found=this.getElementByName(nameOfElement);
    Found.removeEventListener(whichEvent,Callback_to_Remove);
  }
  GetPropertyOfElement(name,property)
  {let Property;
   let found=this.getElementByName(name);
    
   if(property=="height")
    Property=found.style.height;
  if(property=="width")
    Property=found.style.width;
  if(property=="backgroundColor")
    Property=found.style.backgroundColor;
  if(property=="color")
    Property=found.style.color;
  if(property=="fontSize")
    Property=found.style.fontSize;
  if(property=="border")
    Property=found.style.border;   
  if(property=="padding")
    Property=found.style.padding;
  if(property=="margin")
    Property=found.style.margin;
  if(property=="position")
    Property=found.style.position;
  if(property=="left")
    Property=found.style.left;
  if(property=="top")
    Property=found.style.top;
  if(property=="animation")
  Property=found.style.animation;

 return Property;   
  }
  ChangePropertyOfElement(name,whichProperty,value)
  { let element=this.getElementByName(name);
    let PropertyToChange=whichProperty

    if(PropertyToChange=="margin")
    element.style.margin=value;
    if(PropertyToChange=="padding")
    element.style.padding=value;
    if(PropertyToChange=="color")
    element.style.color=value;
    if(PropertyToChange=="backgroundColor")
    element.style.backgroundColor=value;
    if(PropertyToChange=="fontSize")
    element.style.fontSize=value;
    if(PropertyToChange=="border")
    element.style.border=value;
    if(PropertyToChange=="position")
    element.style.position=value;
    if(PropertyToChange=="left")
    element.style.left=value;
    if(PropertyToChange=="top")
    element.style.top=value;
    if(PropertyToChange=="height")
    element.style.height=value;
    if(PropertyToChange=="width")
    element.style.width=value;
    if(PropertyToChange=="animation")
    element.style.animation=value;
  }
  //above methods only work for elements introduced to DOM manager in elements array
  //below are normal Document methods
 QuerrySelector(elementTag)  //original DOM method
 { let Element=this.DOM.querySelector(elementTag);
  return Element;
 }
 GetById(id)//original DOM method
 {let Element=this.DOM.getElementById(id)
  return Element
 }
 Make_Children_By_Horus(Horus_Id,ElementTag,howMany,style,TextIfAny) // //remember same style will be applied on children of Horuses
 {  let WrappedHorus={horus:undefined,Id:undefined};
    let Horus=new DOM_Horus(ElementTag,howMany,style,TextIfAny,this.DOM.body);
    WrappedHorus.Id=Horus_Id;
    WrappedHorus.horus=Horus;
    this.Horuses.push(WrappedHorus);
 }
 GetHorus(Horus_id)
 { let find;
   this.Horuses.forEach(h=>{
    if(h.Id==Horus_id)
    find=h.horus
   })
  return find 
 }
 Attach_Sound_Effect(sound_Url,NameOfElement,onWhichEvent,soundVolume,soundSpeed)   //works on elements introduced to manager
 {  let Element=this.getElementByName(NameOfElement);
    let audio=new Audio(sound_Url);
    audio.playbackRate=soundSpeed;
    audio.volume=soundVolume;
    this.ApplyDOM_Event(NameOfElement,onWhichEvent,SoundPlayer)
    function SoundPlayer()
    { audio.play();
    }
  
 }
 Add_SpeakingEvent(name,What_To_Speak,OnWhatEvent,Repeat_Or_Not)
 { let element=this.getElementByName(name);
  if(Repeat_Or_Not==undefined)
  Repeat_Or_Not=false;

   element.addEventListener(OnWhatEvent,function(){
    let utterance=new SpeechSynthesisUtterance(What_To_Speak);
    speechSynthesis.speak(utterance);
   },Repeat_Or_Not)
  


 }
 CreateChild(ChildType,ChildOf,innerTextIfAny,Child_Id)
 { let child=this.DOM.createElement(ChildType);
   if(innerTextIfAny!==undefined)
   child.innerText=innerTextIfAny;
   child.id=Child_Id;
   ChildOf.appendChild(child);


 }
 RemoveChild(Child_Id,ChildOF)
 {
   ChildOF.removeChild(this.GetById(Child_Id));

 }
}
