import { GLTFLoader } from "./GLTFLoader.js";
import *as THREE from "./three.module.js";
import { RandomPosition } from "./Calculations.js";

export function ModelAdder(url,name_you_assign,Make_Mixer_true_or_false)       //returns a wrapped model
{ var WrappedLoaded_Model={
    model:undefined,position:undefined,Name:undefined,animations:undefined,MakeMixer:Make_Mixer_true_or_false
   }
    let Loader=new GLTFLoader();
 Loader.load(url,function(glb){
 WrappedLoaded_Model.model=glb.scene;
 WrappedLoaded_Model.position=WrappedLoaded_Model.model.position;
 WrappedLoaded_Model.Name=name_you_assign;
 WrappedLoaded_Model.animations=glb.animations;
 })

return WrappedLoaded_Model;
}

export function Multiple_Model_Parsed_3(model_Url,name=""){
    var WrappedLoaded_Model={
        model1:undefined,model2:undefined,model3:undefined,Name:undefined,animations:undefined
       }
        let Loader=new GLTFLoader();
     Loader.load(model_Url,function(glb){
        
     WrappedLoaded_Model.model1=glb.scene.children[0];
     WrappedLoaded_Model.model2=glb.scene.children[2];
     WrappedLoaded_Model.model3=glb.scene.children[3];
     WrappedLoaded_Model.animations=glb.animations;
    
     WrappedLoaded_Model.Name=name;
     WrappedLoaded_Model.animations=glb.animations;
     })
    
    return WrappedLoaded_Model;
}
export function MeshWrapper(mesh,name_you_assign,Make_Mixer_true_or_false){
    var Wrapped_Mesh={
        model:undefined,Name:undefined,MakeMixer:Make_Mixer_true_or_false
       }
  Wrapped_Mesh.model=mesh;
  Wrapped_Mesh.Name=name_you_assign;
  return Wrapped_Mesh;

}

export function MeshMaker(geometry,material){  //to add in colleciton , must wrap it with MeshWrapper()
let mesh=new THREE.Mesh(geometry,material);
return mesh
}
export class SceneManager{  //scene manager object class
root_Scene;
Scene_Collection=[] //store with names
constructor(root_Scene){
    this.root_Scene=root_Scene;
}
Add_to_Collection(Wrapped_Mesh={}){
    this.Scene_Collection.push(Wrapped_Mesh);

}


getObjectByName(name){
    let toFind=name,Found;
    let LookIn=this.Scene_Collection;
    LookIn.forEach(obj=>{
        
        if(obj.Name==toFind){
            Found=obj.model;
            
        }
        
    })
    
    return Found;
}
ChangeObjectScale(obj_Name,scaleX,scaleY,scaleZ){
    let toFind=obj_Name,Found;
    let LookIn=this.Scene_Collection;
    LookIn.forEach(obj=>{
        if(obj.Name==toFind){
            Found=obj.model;
        }
       
    });
    Found.scale.set(scaleX,scaleY,scaleZ);

}
ChangeObjectPosition(obj_Name,posX,posY,posZ){
    let toFind=obj_Name,Found;
    let LookIn=this.Scene_Collection;
    LookIn.forEach(obj=>{
        if(obj.Name==toFind){
            Found=obj.model;
        }
       
    });
    Found.position.set(posX,posY,posZ);

}
ChangeObjectRotation(obj_Name,rotX,rotY,rotZ)
{   let toFind=obj_Name,Found;
    let LookIn=this.Scene_Collection;
    LookIn.forEach(obj=>{
        if(obj.Name==toFind){
            Found=obj.model;
        }
       
    });
    Found.rotation.set(rotX,rotY,rotZ);

}
Add_to_Scene(obj_Name)
{    //object must be present in Scene_Collection
    let toFind=obj_Name,Found;
    let LookIn=this.Scene_Collection;
    LookIn.forEach(obj=>{
        if(obj.Name==toFind){
            Found=obj.model;
        }
       
    })
    this.root_Scene.add(Found)
 
}
Remove_from_Scene(obj_Name="")
{    //object must be present in Scene_Collection
    let toFind=obj_Name,Found;
    let LookIn=this.Scene_Collection;
    LookIn.forEach(obj=>{
        if(obj.Name==toFind){
            Found=obj.model;
        }
        
    })
    this.root_Scene.remove(Found)
}

}

export function ModelClone(model,HowMany)
{ let base=model;
 let WrappedArray=[];
  for(let i=0;i<=HowMany;i++)
  { let WrappedModel={model:undefined,Name:"Wrapped"+i}
    WrappedModel.model=base.clone();
    WrappedArray.push(WrappedModel);

  }
  return WrappedArray;
    
}
export function SynchronousAdder(modelURLs,RandomPositioned=true)  //add an array of different models with just one fxn at random Positions
{ let modelsToAdd=modelURLs;
  let NameID=0;
  var SyncLoads=[]
  modelsToAdd.forEach(url=>{
    NameID++;
  let loaded=ModelAdder(url,"Sync"+NameID);
  SyncLoads.push(loaded);
  });
return SyncLoads;
}

export function MakeImageTexture(url,repeatX,repeatY,wrapS,wrapT)
{ let texture=new THREE.TextureLoader();
 let Texture=texture.load(url);
 Texture.wrapS=wrapS;
 Texture.wrapT=wrapT;
 Texture.repeat.set(repeatX,repeatY);
 return Texture;
}