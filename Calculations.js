
import *as THREE from "./three.module.js";
import {MeshMaker} from "./ModelAdder.js";
import { Mouse_Controls, MovementControls } from "./Game_Mechanics.js";
import { OrbitControls } from "./OrbitControls.js";
export function RadiansOf(degree){
    let r=(Math.PI/180)*degree;
    return r;
}
export  const THREE360Directions=[];
for(let i=0;i<360;i+=3)
{
	let dir=new THREE.Vector3(Math.cos(i),0,Math.sin(i));
	THREE360Directions.push(dir);
}


export function RandomPosition(const_Axis="",const_Axis_Position=0|undefined,Max_Distance,Max_Distance_Ratio){
    let WrappedPosition=new THREE.Vector3();
    if(const_Axis=="x"){
     let ry=Math.floor(Math.random()*Max_Distance)-Max_Distance_Ratio;
     let rz=Math.floor(Math.random()*Max_Distance)-Max_Distance_Ratio;
     WrappedPosition.x=const_Axis_Position;
     WrappedPosition.y=ry;
     WrappedPosition.z=rz;
    }
    if(const_Axis=="z"){
        let ry=Math.floor(Math.random()*Max_Distance)-Max_Distance_Ratio;
        let rx=Math.floor(Math.random()*Max_Distance)-Max_Distance_Ratio;
        WrappedPosition.x=rx;
        WrappedPosition.y=ry;
        WrappedPosition.z=const_Axis_Position;
       }
       if(const_Axis=="y"){
        let rz=Math.floor(Math.random()*Max_Distance)-Max_Distance_Ratio;
        let rx=Math.floor(Math.random()*Max_Distance)-Max_Distance_Ratio;
        WrappedPosition.x=rx;
        WrappedPosition.y=const_Axis_Position;
        WrappedPosition.z=rz;
       }
  return WrappedPosition;

}
export function Scale_Rotation_Adjust(scaleX,scaleY,scaleZ,rotX,rotY,rotZ,Model){
    Model.scale.set(scaleX,scaleY,scaleZ);
    Model.rotation.set(rotX,rotY,rotZ);
    return Model;
}
 
export function Physical_PointMaker(mesh,Name,EffectNumber) //Effect number determines the  number of boundary points 
{ let vector=new THREE.Vector3(mesh.position.x,mesh.position.y,mesh.position.z);
  let WorldPos=mesh.getWorldPosition(vector);
  let PositionVector=new THREE.Vector3(vector.x,vector.y,vector.z);
   
  let WrappedPoint={points:{towardX:undefined,towardZ:undefined,towardNegX:undefined,towardNegZ:undefined},Name:Name};

  let Wrapped={x:[],negX:[],z:[],negZ:[]};
  //wrapping aroundX
  for(let i=mesh.position.x;i<=EffectNumber;i++)
  Wrapped.x.push(new THREE.Vector3(i,PositionVector.y,PositionVector.z));
  for(let i=mesh.position.x;i<=EffectNumber;i++)
  Wrapped.negX.push(new THREE.Vector3(-(i),PositionVector.y,PositionVector.z));
  for(let i=mesh.position.z;i<=EffectNumber;i++)
  Wrapped.z.push(new THREE.Vector3(PositionVector.x,PositionVector.y,i));
  for(let i=mesh.position.z;i<=EffectNumber;i++)
  Wrapped.negZ.push(new THREE.Vector3(PositionVector.x,PositionVector.y,-(i)));

  WrappedPoint.points.towardX=Wrapped.x;
  WrappedPoint.points.towardNegX=Wrapped.negX;
  WrappedPoint.points.towardZ=Wrapped.z;
  WrappedPoint.points.towardNegZ=Wrapped.negZ;
 return WrappedPoint;
}


export function Collision_Check(WrappedPoint,withWhatMesh,CollEffectDistance)
{  var BoradCast={messages:[],DistanceVectors:[]};

  //warning
   if(CollEffectDistance<1||CollEffectDistance==undefined)console.warn("Collision effect distance must be greater than zero ");
  //
  let Boundary=WrappedPoint.Points;
  let Main=new THREE.Vector3().copy(withWhatMesh.position);
  Boundary.forEach(boundary=>{
    let d=Main.distanceTo(boundary);
    if(d<=CollEffectDistance)
    BoradCast.messages.push("Collision occured at "+boundary);

    BoradCast.DistanceVectors.push(d);
  })

  return BoradCast;
}


export class Physics_Manager{  //currently supports collision with bodies introduced to physics
 Bodies_Collection=[];
 Scene_Manager;
 EffectNumber;
 CollEffectNumber;
 Main_Player;
 Collision_Points=[];
 PointBoundaries=[];
 TurainVectors={};
constructor(Scene_Manager,EffectNumber,Main_Player_Mesh,CollisionEffectNumber)   //Use introduce body method to add to Bodies Collection
{ this.Scene_Manager=Scene_Manager;
  this.EffectNumber=EffectNumber;
  this.Main_Player=Main_Player_Mesh;
  this.CollEffectNumber=CollisionEffectNumber;
  console.log("Manager captured with collection");
  console.log(this.Scene_Manager.Scene_Collection);


}
Introduce_Body(Name_of_body)
{  let WrappedBody={model:this.Scene_Manager.getObjectByName(Name_of_body),Points:{},Name:""};
   let captured=this.Scene_Manager.getObjectByName(Name_of_body);
  let points=BoundaryMaker(captured,Name_of_body+"_Points",this.EffectNumber);
  WrappedBody.Points=points;
  WrappedBody.Name=Name_of_body;
 this.Bodies_Collection.push(WrappedBody); 
}

PushBackUpdate(PushBack_Effect_Number,CollEffectN) //pushes back the player with small distance when collision detected 
//coll effect number is actuall distance check between physical points
{
  for(let i=0;i<this.Bodies_Collection.length;i++)
  { let coll=Collision_Check(this.Bodies_Collection[i].Points,this.Main_Player,CollEffectN);
    
    for(let j=0;j<coll.messages.length;j++)
    { 
      if(coll.messages[j].includes("Collision"))
      {this.Main_Player.translateZ(-PushBack_Effect_Number);
        
      }
    } 
  
  }

}

MakeTurrainBehaviour(GroundMesh)
{ let ground=GroundMesh;
  let points=TurrainListener(ground);
  this.TurainVectors=points;
}
TurrainBehviour(Vectorpoints,MainPlayerMesh)
{ Vectorpoints.forEach(vector=>{
  let MainVector=MainPlayerMesh.position;
  let AssumedVector=vector;
AssumedVector.y=1;
  let d=MainVector.distanceTo(AssumedVector);
  if(d<10)
  console.warn("Upward");
})

}
Update(UpdateMovingBodies=false,GravityUpdate=false)  //call with animation frame 
{   //to detected collision between moving bodies , must make UpdateMovingBodies=true
  if(UpdateMovingBodies==false)
  {this.PushBackUpdate(this.EffectNumber,this.CollEffectNumber)};

  if(UpdateMovingBodies==true)
  {this.Bodies_Collection.forEach(body=>{
    body.Points=Physical_PointMaker(body.model,body.Name,this.EffectNumber);
    
    this.PushBackUpdate(this.EffectNumber,this.CollEffectNumber);
  
  })}
//turrain
//this.TurrainBehviour(this.TurainVectors,this.Main_Player);
 
}



}


export  function BoundaryMaker(mesh_for_Trace,NameofBoundary,Influence)  //actual Physical Boundary
{  let mesh=mesh_for_Trace;
  var WrappedPoints={Name:NameofBoundary,Points:[]}
  let Sphere=MeshMaker(new THREE.SphereGeometry(mesh.scale.x+2,10,10),new THREE.MeshBasicMaterial({transparent:true}))
  let count=Sphere.geometry.attributes.position.array.length;
  const ConstantY=mesh.position.y
  console.log(count);
  var Points=[];
  for(let i=0;i<count;i++){
    let thisPoint=new THREE.Vector3(
      Sphere.geometry.getAttribute("position").getX(i)+mesh.position.x,
      ConstantY,
      Sphere.geometry.getAttribute("position").getZ(i)+mesh.position.z,
    );
    Points.push(thisPoint);
  }
  
WrappedPoints.Points=Points;

 return WrappedPoints

}

function TurrainListener(TurainMesh)
{let mesh=TurainMesh;
  var WrappedPoints=[]
 let geometry=mesh.geometry;
 let count=geometry.attributes.position.array.length;
 for(let i=0;i<count;i++){
  let Pointis=new THREE.Vector3(
    geometry.attributes.position.getX(i),
    geometry.attributes.position.getY(i),
    geometry.attributes.position.getZ(i),
  );
  WrappedPoints[i]=Pointis;
  let Assumed=new THREE.Vector3().copy(Pointis);
  Assumed.y+=100;
  WrappedPoints[Math.floor(Math.random()*count)]=Assumed;
 }
 var ModifiedPoints=[];
 WrappedPoints.forEach(p=>{if(p.y>100)ModifiedPoints.push(p)})
//return WrappedPoints;
return ModifiedPoints;
}

export  class AIController
{ model=undefined;
  DOM_Keys=[];
  
  Controls;
  CurrentlyUsed;
  constructor(model,Supposed_Keys=[],DuplicatedSupposed_Keys=[],Speed)
  { this.model=model;
    DuplicatedSupposed_Keys.forEach(key=>{
      this.DOM_Keys.push(key);
    })
    this.Controls=new MovementControls(this.model);
    this.Controls.DOM_Keys.front=Supposed_Keys[0];
    this.Controls.DOM_Keys.back=Supposed_Keys[1];
    this.Controls.DOM_Keys.right=Supposed_Keys[2];
    this.Controls.DOM_Keys.left=Supposed_Keys[3];
    
    this.Controls.SpeedOfMovement=Speed;
    
  }
DOM_KeysController(currentKey) //call this with an interval Control Method inside an interval handler
{ let random=Math.random();
  if(random>0.5)
  this.RegisterKeyDown(currentKey);
  else
  this.RegisterKeyUp(currentKey);

  this.CurrentlyUsed=currentKey;
}
RegisterKeyDown(currentKey){
this.Controls.KeyDown_RegisterState(currentKey);
}
RegisterKeyUp(currentKey)
{this.Controls.KeyUp_RegisterState(currentKey);
  this.CurrentlyUsed=currentKey;

}

Update(Interval,MaxInterval) //pass a created varriable before req-Ani-Frame  ,Max interval should be greater than 100
{  
  if(Interval<MaxInterval/4)
  {this.DOM_KeysController(this.DOM_Keys[0]);}
  if(Interval<MaxInterval/3&&Interval>MaxInterval/4)
  {this.DOM_KeysController(this.DOM_Keys[1]);}
  if(Interval<MaxInterval/2&&Interval>MaxInterval/4)
  this.DOM_KeysController(this.DOM_Keys[2]);
  if(Interval<MaxInterval+10&&Interval>MaxInterval/2)
  this.DOM_KeysController(this.DOM_Keys[3]);
  
  this.Controls.Update(this.CurrentlyUsed);
  this.Controls.camera_PlayerGroup.rotation.y+=0.5;
  
  
  
}
}

export class ModifiedOrbitControls extends OrbitControls
{
  constructor(objectToApply,renderer_DomElement)
  {this.object=objectToApply;
    this.domElement=renderer_DomElement;
  }
  UpdatePosition_wrt_Player(Player_position)
  { let cameraPosition=this.object.position;
    

  }

}
