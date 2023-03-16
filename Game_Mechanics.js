import *as THREE from "./three.module.js";
import { RandomPosition} from "./Calculations.js";
import {ModelAdder} from "./ModelAdder.js"

//----------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//Mouse Controls
export class Mouse_Controls
{ Margins={x:[],y:[]}; //all the points on midlines as by Css
  Origin={x:undefined,y:undefined};
  camera_PlayerGroup;
  windowWidth;
  windowHeight;
  Max_Rotation_Reached=false;
  InstantaneousQuadrent;
  constructor(PlayerCameraGroup,window_innerWidth,window_innerHeight){
    this.camera_PlayerGroup=PlayerCameraGroup;
    this.windowWidth=window_innerWidth;
    this.windowHeight=window_innerHeight;
    this.Create_Margins();
  }

  Create_Margins(){
    let Margin_to_X=[]    //middle line for x
    let MidX=Math.floor(this.windowHeight/2);
    for(let i=0;i<=this.windowWidth;i++){
        Margin_to_X.push({x:i,y:MidX})
    }

    let Margin_to_Y=[]    //middle line for y
    let MidY=Math.floor(this.windowWidth/2);
    for(let i=0;i<=this.windowHeight;i++){
        Margin_to_Y.push({x:MidY,y:i})
    }
  this.Margins.x=Margin_to_X;
  this.Margins.y=Margin_to_Y;
  this.Origin.x=MidX;
  this.Origin.y=MidY;
  }

QuadRant_Search(mouseX,mouseY){
    let Quadrant;  //1 2  3 4 quadrant  1 means x,y pos , 2 means x neg and y pos etc
    let isX,isY;
    let RelativeMousePosition=new THREE.Vector2();
    if(mouseX<this.Origin.x)
    RelativeMousePosition.x=-mouseX;
    else RelativeMousePosition.x=mouseX;
    if(mouseY<this.Origin.y)
    RelativeMousePosition.y=-mouseY;
    else RelativeMousePosition.y=mouseY;

  //converted mousex and mouseY to relative positions with Orgin

  
    let querryPoint=new THREE.Vector2();
    querryPoint.x=Math.floor(RelativeMousePosition.x);
    querryPoint.y=Math.floor(RelativeMousePosition.y);
    
   //mid
   let Origin=this.Origin;

    function FindOnX(){
        if(querryPoint.x>Origin.x)
            isX="pos";
        if(querryPoint.x<Origin.x)
            isX="neg";
        if(querryPoint.x==Origin.x)
        isX="origin";
    }
    function FindOnY()
    { if(querryPoint.y>Origin.y)
        isY="pos";
      if(querryPoint.y<Origin.y)
      isY="neg";
      if(querryPoint.y==Origin.y)
      isY="origin";
    }

    FindOnX();
    FindOnY();
   //
  


   if(isX=="pos"&&isY=="pos")
   Quadrant=1;
   if(isX=="neg"&&isY=="neg")
   Quadrant=3;
   if(isX=="pos"&&isY=="neg")
   Quadrant=4
   if(isX=="neg"&&isY=="pos")
   Quadrant=2;
   if(isX=="origin"||isY=="origin")
   Quadrant=0; //0 means at orgin so no rotation

return Quadrant;
}
RadianConvert(degree)
{ let r=(Math.PI/180)*degree;
return r;

}

Rotational_instance_wrt_X(clientX)   //theeta finder
{ 
  const ConstantY=50;
  let newY_Origin=new THREE.Vector2(this.Origin.x,ConstantY);
  let D_New_Y_Origin=newY_Origin.distanceTo(new THREE.Vector2(clientX,ConstantY));//perpendicular
  let ClientX_Distance=new THREE.Vector2(this.Origin.x,this.Origin.y).distanceTo(new THREE.Vector2(clientX,ConstantY));//hypotenuse

  let sinTheeta=D_New_Y_Origin/ClientX_Distance;

  let TheetaDegree=Math.asin(sinTheeta);
  return (-TheetaDegree*12);

}

//theeta finder for Y will soon be done


Update(Mouse_Event_x,Mouse_Event_y)   //call a DOM listener and store clientX and clientY in a varriable and call this with reqAniFrame
{  let Mouse_in_Quadrent=this.QuadRant_Search(Mouse_Event_x,Mouse_Event_y);
        
   this.camera_PlayerGroup.rotation.y=this.Rotational_instance_wrt_X(-Mouse_Event_x);
   
  
   //console.log(this.Rotational_instanceAt(Mouse_Event_x,Mouse_Event_y)+" and is at "+Mouse_in_Quadrent+" quadrant");   
 this.InstantaneousQuadrent=Mouse_in_Quadrent;
}
}
//

//-----------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//Movement Controls
export class MovementControls{ 
  //Must be connected with DOM keyDown and keyUp event
  //for quality results and animation must work in sync with Animation Mixer

camera_PlayerGroup;
DOM_Keys={front:undefined,back:undefined,right:undefined,left:undefined,OtherBehavioural:[]};//otherbehavioual must be registered by RegisterKey method
State_Of_Player="Idle"; //default state is idle
Animations={attacks:[],moving_running:[],dying:[],extras:[]};   //general
SpeedOfMovement;
BindedActions=[];//for playing animations ;
Pushed_Animation_Information=[] //you must fill this first then use BindAnimations
AnimationManager; //this controls animaitons
CurrentlyPlaying;

constructor (camera_PlayerGroup,frontKey,backKey,rightKey,leftKey,MovementSpeed)
  { this.DOM_Keys.front=frontKey;
    this.DOM_Keys.back=backKey;
    this.DOM_Keys.left=leftKey;
    this.DOM_Keys.right=rightKey;
    this.camera_PlayerGroup=camera_PlayerGroup;
    this.SpeedOfMovement=MovementSpeed;
  }   
  KeyDown_RegisterState(key) //use with keydown 
  { let NewState=this.DecideState(key,true);
     if(NewState==undefined||null)
     this.State_Of_Player="Idle";
     else 
     this.State_Of_Player=NewState;
  }
  KeyUp_RegisterState(key){ //use with keyUp
    let NewState=this.DecideState(key,false);
     if(NewState==undefined||null)
     this.State_Of_Player="Idle";
     else 
     this.State_Of_Player=NewState;
  }

  DecideState(key,isDown){
    let newState;

    if(key==this.DOM_Keys.front||key==this.DOM_Keys.left||key==this.DOM_Keys.back||this.DOM_Keys.right)
    { if(isDown==true)
      newState="Moving";
      if(isDown==false)
      newState=="Idle";}

    return newState
  }
  Direction_Decide(key){
  let SpeedAndDirection={speed:this.SpeedOfMovement,dir:undefined};
  if(key==this.DOM_Keys.front)
  SpeedAndDirection.dir="pos";
  if(key==this.DOM_Keys.back)
  SpeedAndDirection.dir="neg";
  if(key==this.DOM_Keys.right)
  SpeedAndDirection.dir="right";
  if(key==this.DOM_Keys.left)
  SpeedAndDirection.dir="left";

return SpeedAndDirection;
  }

BindAnimations(AnimationManager)//use this if you want certain animation to be played with keys sequence
{ //AnimationSequence_oBJECTS must be like {nameofAnimation,onWhichKey},you can do this by calling MakeAnimationData method recurrsivelty
  let Information=this.Pushed_Animation_Information;
  this.AnimationManager=AnimationManager;
 
  Information.forEach(info=>{
    let BindedAnimation={NameOfAnimation:undefined,onWhichKey:undefined}
  BindedAnimation.NameOfAnimation=info.NameofAnimation;
  BindedAnimation.onWhichKey=info.onWhichKey;
  this.BindedActions.push(BindedAnimation);
  })
}
MakeAnimationData(nameofAnimation,onWhichKey)  //can be called recurssively
{ let Querry={NameofAnimation:nameofAnimation,onWhichKey:onWhichKey};
  this.Pushed_Animation_Information.push(Querry);
}
ListenForAnimation(keyDown)   //call with reqAniframe
{ if(this.CurrentlyPlaying!==undefined)
  this.AnimationManager.StopAnimation(this.CurrentlyPlaying)
   this.BindedActions.forEach(action=>{
  if(keyDown==action.onWhichKey)
 { 
  this.AnimationManager.PlayAnimation (action.NameOfAnimation);
   this.CurrentlyPlaying=action.NameOfAnimation

  }
 
})

} ///this decides what to play , this mixes.


Update(keyDown)  //store keys in varriables and pass it in req ani frame
{  let Direction_Obj=this.Direction_Decide(keyDown);
   //more modifications for animations will be soon
   if(this.State_Of_Player=="Moving")
   {if(Direction_Obj.dir=="pos"){
    this.camera_PlayerGroup.translateZ(-Direction_Obj.speed);
   }
   if(Direction_Obj.dir=="neg"){
    this.camera_PlayerGroup.translateZ(Direction_Obj.speed);
    
   }
   if(Direction_Obj.dir=="right"){
    this.camera_PlayerGroup.translateX(Direction_Obj.speed);
    
   }
   if(Direction_Obj.dir=="left"){
    this.camera_PlayerGroup.translateX(-Direction_Obj.speed);
   
   }

 }}

}

export function CollectionAdder(ModelSource,MaximumModel,constAxis,constAxisPosition,MaxDistance,MaxDistanceRatio)   //adds multipleModels at random locations and returns an object containing them
{ let Models=[];
  let BaseModel=ModelAdder(ModelSource,"TreeBase");

  setTimeout(TimeByPass,5000);
  function TimeByPass()
  {for(let i=0,j=0;i<MaximumModel;i++)
    { j++;
    let Wrapped={model:undefined,Name:undefined};
    let newTree=BaseModel.model.clone();
    Wrapped.model=newTree;
    let newPosition=RandomPosition(constAxis,constAxisPosition,MaxDistance,MaxDistanceRatio)
    Wrapped.model.position.set(newPosition.x,newPosition.y,newPosition.z);
    Wrapped.Name="Tree "+j;
    Models.push(Wrapped);

  }
  }
  return Models;
}
//---------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------

//Animation Manager
export class AnimationManager //just like scene manager manages scene information , this class obj handles all the animations , to work Obj must be introduced to SceneManager Class
{WrappedAnimationObjects=[];
  Scene_Manager;
  ClockDelta=new THREE.Clock();
  AnimationMixers=[];
  CurrentAnimation;
 constructor(Scene_Manager)  //must have controll over scene manager
 { this.Scene_Manager=Scene_Manager;  //for better performance , use it when all the models are loaded ;
   for(let i=0;i<this.Scene_Manager.Scene_Collection.length;i++)
    {  let wrapped={mixer:undefined,Name:Scene_Manager.Scene_Collection[i].Name};
      let mixer=new THREE.AnimationMixer();
      mixer._root=Scene_Manager.Scene_Collection[i].model;
     wrapped.mixer=mixer;
     this.AnimationMixers.push(wrapped);
    }
 } 
 IntroduceAnimation(Clip,AnimationBindWith,NameOfAnimation)  //name you want to give
{ let Wrapped_Object={Name:NameOfAnimation,animation:undefined}
  let MixerTarget=this.FindMixerByName(AnimationBindWith);
  let action=MixerTarget.clipAction(Clip);
  Wrapped_Object.animation=action;
   this.WrappedAnimationObjects.push(Wrapped_Object);

}

FindMixerByName(Name){
  let Found=undefined;
  this.AnimationMixers.forEach(mixer=>{
    if(mixer.Name==Name){
      Found=mixer.mixer;
    }
  })
  return Found;
}
FindAnimationByName(Name){
  let Found;
  this.WrappedAnimationObjects.forEach(obj=>{
    if(obj.Name==Name){
      Found=obj.animation;
    }
  })
  return Found;
}
RefixAnimations(){ //event listener for mixeer , soon 
  
}
UpdateAnimationProperties(AnimationName,loop,clampWhenFinished,Duration){
 let find=this.FindAnimationByName(AnimationName);
 find.setLoop(loop);
 find.clampWhenFinished=clampWhenFinished;
 find.setDuration(Duration);
}
PlayAnimation(AnimationName)
{ let getAnimation=this.FindAnimationByName(AnimationName);
  getAnimation.play();
  this.CurrentAnimation=getAnimation;

}
StopAnimation(AnimationName){
  let getAnimation=this.FindAnimationByName(AnimationName);
  getAnimation.stop();
}


InteractWith(InteractingEntity,InteractingWith,InteractionProperty,CallbackWhatToDo,ifPositionThenDistance) //must be called with requestAnimationFrame
//supported (rotationSame,rotationOpposite,position) must be used for (<) for position;
{ let Querry={interacting:InteractingEntity,interactingWith:InteractingWith,propertyToCheck:InteractionProperty};
  if(Querry.propertyToCheck=="position"){
    let PositionQuerry={P1:Querry.interacting.position,P2:Querry.interactingWith.position,conditionalDistance:undefined};
    let distance=PositionQuerry.P1.distanceTo(PositionQuerry.P2);
    if(ifPositionThenDistance==undefined)
    PositionQuerry.conditionalDistance=7;
    else PositionQuerry.conditionalDistance=ifPositionThenDistance
    if(distance<PositionQuerry.conditionalDistance||distance<PositionQuerry.conditionalDistance-1)
    CallbackWhatToDo();
  }
  if(Querry.propertyToCheck=="rotationSame")
  { let RotationQuerry={P1:Querry.interacting.rotation.y,P2:Querry.interactingWith.rotation.y}
    if(RotationQuerry.P1==RotationQuerry.P2)
    CallbackWhatToDo();

  }
  if(Querry.propertyToCheck=="rotationOpposite")
  { let RotationQuerry={P1:Querry.interacting.rotation.y,P2:Querry.interactingWith.rotation.y}
  if(RotationQuerry.P1==(-RotationQuerry.P2))
  CallbackWhatToDo();

  }

}

PlayEveryAnimation()
{ this.WrappedAnimationObjects.forEach(ani=>{
  ani.animation.play();
}) 
}
StopEveryAnimation()
{this.WrappedAnimationObjects.forEach(ani=>{
  ani.animation.stop();
}) 

}
Update()
{ let Delta=this.ClockDelta.getDelta();
  this.AnimationMixers.forEach(wo=>{
    wo.mixer.update(Delta)
  }) 

}

}
//-----------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------




