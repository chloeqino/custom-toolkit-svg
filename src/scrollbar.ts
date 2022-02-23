import {Window, Widget, WidgetState, IWidgetStateEvent,States,InputType} from "./core";
// importing code from SVG.js library
import {SVG, Svg, G, Rect, Container, Text, Box} from "./core";
class Srcollbar extends Widget{
    private _bar: Rect;
    private _group: G;
    private _thumb: Rect;
    private _active:boolean = false;
    private thumb_y = 0;
   // private defaultText: string= "Button";
    //private defaultFontSize: number = 18;
    private defaultWidth: number = 15;
    private defaultHeight: number = 400; 
    private defaultPercet:number = 0;
    private previous_y = this.thumb_y;
    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        //this._input = this.defaultText;
        
        // render widget
        this.render();
        // set default or starting state
        this.idleupstate();
        this.parent.attach((input, event)=>{
            
            
           if(Object(event).type=="mousemove"){
               //console.log("bodypressed from textbox");
            if(this._active == true){
               //console.log(event);
               let y = Object(event).offsetY;
               
                   
               y -= Number(this._thumb.height())/2;
               this.previous_y = this.thumb_y;
               this.thumb_y = y;

               
               this.update();
            }
           }
           if(Object(event).type=="mouseup"){
            //console.log("bodypressed from textbox");
         if(this._active==true){
            this._active  = false;
            this.raise(0,"idle");
         }
        }        
         
      })
    }
    move(x: number, y: number): void {
        if(this._group != null)
            this._group.move(x,y);
            this.update();
    }
    render(): void {
        this._group = this.parent.window.group();
        this._bar = this._group.rect(this.width, this.height);
        this._bar.stroke("black");
        this._bar.fill("#9F93E5");
        this._thumb = this._group.rect(this.width,this.height/10);
        this._thumb.fill("lavender");

        // Add a transparent rect on top of text to prevent selection cursor
        this._group.rect(this.width, this.height).opacity(0);

        this.backcolor = "transparent";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._group);
        this.registerEvent(this._thumb);
    }

    update(): void {
        //this._bar.width(this.width*this._percet/100);
        this.thumb_y = Math.min(this.thumb_y,Number(this._bar.y())+Number(this._bar.height())-Number(this._thumb.height()));
               //console.log(this.thumb_y+"bar height"+Number(this._bar.height()));
        this.thumb_y = Math.max(Number(this._bar.y()),this.thumb_y);
        this._thumb.y(this.thumb_y);
        if(this.previous_y<this.thumb_y){
            //console.log("scrolldown");
            this.raise(0, "scrolldown");
        }else if(this.previous_y>this.thumb_y){
            //console.log("scroll up");
            this.raise(0, "scrollup");
        }
        this.previous_y = this.thumb_y;
    }
    
    transition(inputType:InputType, event:string): void{
        if (inputType == InputType.MouseDown){
            if(this.currentState() == States.Hover){
                this.current = States.Pressed;
                this.pressedstate();
                this._active = true;
                this.raise(inputType, event);
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
                this.raise(inputType, event);
            }
        }else if(inputType == InputType.MouseOver){
            
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

    private hoverstate(){
       // this.backcolor = "lightgray";
    }
    private pressrelease(){
        
        
    }
    private hoverpressedstate(){}
    private idleupstate(){
       // this.backcolor = "#9F93E5";
    }
    private idledownstate(){}
    private pressedstate(){
        
        console.log("scrolling");
        
    }
    private pressedout(){}
}
export {Srcollbar};