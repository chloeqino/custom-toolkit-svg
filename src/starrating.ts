import { eid, off } from "@svgdotjs/svg.js";
import {Window, Widget, WidgetState, IWidgetStateEvent,States,InputType} from "./core";
// importing code from SVG.js library
import {SVG, Svg, G, Rect, Container, Text, Box,Polygon} from "./core";

class Star extends Widget{
    private _group:G;
    private _box:Rect;
    private _active = false;
    private _hover = false;
    private _star:Polygon;
    private defaultWidth = 60;

    constructor(parent:Window){
        super(parent);
        this.render();
        this.width = this.defaultWidth;
    }
    update(): void {
        if(this._active){
            this._star.fill("#9F93E5");
        }else{
            this._star.fill("lightgray");
        }
    }
    set active(a:boolean){
        this._active = a;
        this.update();
    }
    get active():boolean{
        return this._active;
    }
    set hover(h:boolean){
        this._hover = h;
        
            if(this._hover){
                this.hoverstate();
            }else{
                if(this._active){
                    this._star.fill("lavender");
                }else{
                this._star.fill("lightgray");
                }
               
            }
        
    }
    idle():void{
        this.idleupstate();
    }
    move(x: number, y: number): void {
        if(this._group != null)
            this._group.move(x,y);
            this.update();
    }
    get group():G{
        return this._group
    }
    render(){
        this._group = this.parent.window.group();
        this._group.attr("class","star")
        this._box = this._group.rect(60,50);
        this._box.fill("transparent");
    
        this._star = this._group.polygon('25,2.5 10,49.5 47.5,19.5 2.5,19.5 40,49.5');
        this.idleupstate();
        this.registerEvent(this._group);
        this.registerEvent(this._star);
    }
    transition(inputType: InputType, event: string): void {
        if (inputType == InputType.MouseDown){
            if(this.currentState() == States.Hover){
                this.current = States.Pressed;
                this.pressedstate();
                
                this.raise(inputType, "pressed");
            }
        }else if(inputType == InputType.MouseUp){
            if(this.currentState() == States.HoverPressed){
                this.current = States.Hover;
                this.hoverstate();
            }else if(this.currentState() == States.IdleDn){
                this.current = States.IdleUp;
            }else if(this.currentState() == States.Pressed){
                this.current = States.Hover;
                this.hoverstate();
                this.pressrelease();
                // This is the 'click' event
                
            }
        }else if(inputType == InputType.MouseOver){
            this.raise(inputType, "hover");
            if(this.currentState() == States.IdleDn){
                this.current = States.HoverPressed;
            }else if(this.currentState() == States.IdleUp){
                this.current = States.Hover;
                this.hoverstate();
            }else if(this.currentState() == States.PressedOut){
                this.current = States.Pressed;
            }
        }else if(inputType == InputType.MouseOut){
            
            if(this.currentState() == States.HoverPressed){
                this.current = States.IdleDn;
            }else if(this.currentState() == States.Hover){
                this.current = States.IdleUp;
                this.idleupstate();
            }else if(this.currentState() == States.Pressed){
                this.current = States.PressedOut;
            }
        }else if(inputType == InputType.KeyPress){
            //console.log(event);
        }
        // uncomment the following line for state change debug output in the console.
        //console.log("Widget: " + InputType[inputType] + " State: "+ States[this.currentState()]);
    
    }
    public returnHover(){
        this._star.fill("#c0bae3");
    }
    private hoverstate(){
        if(!this._active){
        this._star.fill("lavender");
        }else{
            this._star.fill("#9F93E5");
        }
    }
    private pressrelease(){
        
    }
    private hoverpressedstate(){}
    private idleupstate(){
        this.backcolor = "#9F93E5";
        if(this._active){
            this._star.fill("#9F93E5");
        }else{
            this._star.fill("lightgray");
        }
    }
    private idledownstate(){}
    private pressedstate(){
        this.backcolor = "silver";
        
    }
    private pressedout(){}
}
class StarRating extends Widget{
    private stars:Star[];
    private _group:G;
    private _box:Rect;
    private _active = false;
    private defaultWidth = 60;
    private rating:number = 0;
    constructor(parent:Window){
        super(parent);
        // set defaults
        //this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        
        this.stars = [];

        // render widget
        this.render();
        // set default or starting state
        this.idleupstate();
    }
    update(): void {
        for(let i = 0; i< this.stars.length;i++){
           
            this.stars[i].active = (i<=this.rating-1);
        
        }
        this.raise(10,"onChange");
    }
    set value(r:number){
        this.rating = r;
        this.update();
    }
    get value():number{
        return this.rating;
    }
    move(x: number, y: number): void {
        if(this._group != null)
            this._group.move(x,y);
            
             
            this.update();
    }
    updateHover(index:number){
        for(let i = 0; i< this.stars.length;i++){
           
                this.stars[i].hover = (i<=index);
                if(i==index&&this.stars[i].active){
                    this.stars[i].returnHover();
                }
            
        }
    }

   render(): void {
    this._group = this.parent.window.group();
    for(let i = 0; i<5; i++){
        let star = new Star(this.parent);
        star.move(i*60,Number(this._group.y()));
        star.stateEvent().attach((input, event)=>{
            //test_text.text("Button was clicked");
            //console.log(this)
            console.log(event);
            if(event=='hover'){
                this.updateHover(i);
            }
            if(event=="pressed"){
                this.rating = i+1;
                this.update();
            }
        
        });
        star.active = i<=this.rating-1;
        this.stars.push(star);
        this._group.add(star.group);
        this.registerEvent(this._group);
    }
   }
   transition(inputType:InputType, event:string): void{
    if (inputType == InputType.MouseDown){
        if(this.currentState() == States.Hover){
            this.current = States.Pressed;
            this.pressedstate();
            
        }
    }else if(inputType == InputType.MouseUp){
        if(this.currentState() == States.HoverPressed){
            this.current = States.Hover;
            this.hoverstate();
        }else if(this.currentState() == States.IdleDn){
            this.current = States.IdleUp;
        }else if(this.currentState() == States.Pressed){
            this.current = States.Hover;
            this.hoverstate();
            this.pressrelease();
            // This is the 'click' event

            //this.raise(inputType, event);
        }
    }else if(inputType == InputType.MouseOver){
        console.log("hover");
        if(this.currentState() == States.IdleDn){
            this.current = States.HoverPressed;
        }else if(this.currentState() == States.IdleUp){
            this.current = States.Hover;
            this.hoverstate();
        }else if(this.currentState() == States.PressedOut){
            this.current = States.Pressed;
        }
    }else if(inputType == InputType.MouseOut){
        console.log("out");
        this.idleupstate();
        //this.updateHover(-1);
        if(this.currentState() == States.HoverPressed){
            this.current = States.IdleDn;
        }else if(this.currentState() == States.Hover){
            this.current = States.IdleUp;
            this.idleupstate();
        }else if(this.currentState() == States.Pressed){
            this.current = States.PressedOut;
        }
    }else if(inputType == InputType.KeyPress){
        //console.log(event);
    }
    // uncomment the following line for state change debug output in the console.
    //console.log("Widget: " + InputType[inputType] + " State: "+ States[this.currentState()]);
}
private pressedstate(){
    //this.backcolor = "silver";
    
   
    
}
private idleupstate(){
    //this.backcolor = "transparent";
    for(let i=0;i<this.stars.length;i++){
        this.stars[i].idle();
    }
    
}
private pressrelease(){
    
}

private hoverstate(){
    //this.backcolor = "lightgray";
    console.log("hover");
}
}
export {StarRating}