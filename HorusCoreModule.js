export  class DOM_Horus{
    Element_To_Create={
        asDOM:undefined,
        thisMany:undefined,
        Styling:undefined,textContent:undefined
    };
    DOMElements=[];
    Appendthis=undefined;
    IDS=[];
    constructor(Elements_Type_To_Create="",How_Many=0,StyleOfElement="",textToShow="",What_to_Append){
     this.Element_To_Create.asDOM=Elements_Type_To_Create;
     this.Element_To_Create.thisMany=How_Many;
     this.Element_To_Create.Styling=StyleOfElement;
    this.Element_To_Create.textContent=textToShow;
    this.Appendthis=What_to_Append;
    if(typeof What_to_Append!="object")console.warn("Horus can append only html elements, this is not html element")
    try {
        for(let i=0;i<=How_Many-1;i++){
            this.DOMElements[i]=document.createElement(this.Element_To_Create.asDOM)
            this.Appendthis.appendChild(this.DOMElements[i]);
            this.DOMElements[i].style=this.Element_To_Create.Styling;
            if(this.Element_To_Create.textContent==""){
                this.DOMElements[i].textContent="";
                console.warn("There is no text content for children ");
            }
            else {
                this.DOMElements[i].textContent=this.Element_To_Create.textContent;
            }
        }
      //  this.Shift_Children_Randomly();

    } catch (error) {
        
      
            console.error("Horus can only create DOM elements , not a JS varriable")
       
       
    }

    }
    Destroy_Children(Children_To_Destroy="which children to destroy (first) or (last) ",Quantity=0){
        if(Children_To_Destroy.includes("all")){
            for(let i=0;i<=this.DOMElements.length-1;i++)
            document.body.removeChild(this.DOMElements[i])
            console.warn(" as you didnt specify the number or identity of childen so Horus have destroyed all its Children")
        }
        if(Children_To_Destroy.includes("first")&&Quantity!=0)
        {for(let i=0;i<Quantity-1;i++){
            document.body.removeChild(this.DOMElements[i])
            console.warn("Horus have destroyed its first "+Quantity+" children ");
        }

        }
        if(Children_To_Destroy.includes("last")&&Quantity!=0)
        {for(let i=this.DOMElements.length-1;i>Quantity;i--){
            document.body.removeChild(this.DOMElements[i])
            console.warn("Horus have destroyed its last "+Quantity+" children ");
        }

        }

    }
    Shift_Children_Randomly(){
        for(let i=0;i<=this.Element_To_Create.thisMany-1;i++){
            let l=Math.floor(Math.random()*90);
            let t=Math.floor(Math.random()*90);
            if(this.Element_To_Create.Styling.includes("absolute")||this.Element_To_Create.Styling.includes("relative")){
                this.DOMElements[i].style.left=l+"%";
                this.DOMElements[i].style.top=t+"%";
            }
            else {
                console.warn("Horus will not shift children because you did not set CSS position to either relative or absolute");
            }
        //    this.Make_Children_Responsive_Normal("click"); //by default i have set them click event
        }
    }
    Make_Children_Responsive_Normal(What_Kind_of_Responsive="",What_They_do_In_function){
        for(let i=0;i<=this.Element_To_Create.thisMany-1;i++){
            this.DOMElements[i].addEventListener(What_Kind_of_Responsive,What_They_do_In_function,true);
        }
        console.log("Children have made Responsive by as  "+What_Kind_of_Responsive+"and they will execute callback you passed");
    }
    ID_Assigner(ID_Array=[]){
        for(let i=0;i<this.DOMElements.length;i++){
            this.DOMElements[i].id=ID_Array[i];
            this.IDS=ID_Array;
        }
    }
}