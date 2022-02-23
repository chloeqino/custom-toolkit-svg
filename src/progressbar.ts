import {Window, Widget, WidgetState, IWidgetStateEvent,States,InputType} from "./core";
// importing code from SVG.js library
import {SVG, Svg, G, Rect, Container, Text, Box} from "./core";
class Progressbar extends Widget{
    private _rect: Rect;
    private _group: G;
    private _bar: Rect;
    private _input: string;
    private _width: number;
    private _height: number;
    private _percet: number;
   // private defaultText: string= "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 350;
    private defaultHeight: number = 15; 
    private defaultPercet:number = 0;
    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        //this._input = this.defaultText;
        this._percet = this.defaultPercet;
        // render widget
        this.render();
        // set default or starting state
        this.idleupstate();
    }
    move(x: number, y: number): void {
        if(this._group != null)
            this._group.move(x,y);
            this.update();
    }
    set value(n:number){
        this._percet = n;
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("black");
        this._rect.fill("transparent");
        this._bar = this._group.rect(this.width*this._percet/100,this.height);
        this._bar.fill("#9F93E5");

        // Add a transparent rect on top of text to prevent selection cursor
        this._group.rect(this.width, this.height).opacity(0);

        this.backcolor = "transparent";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._group);
        this.registerEvent(this._rect);
    }

    update(): void {
        this._bar.width(this.width*this._percet/100);
    }
    get value():number{
        return this._percet;
    }
    transition(inputType:InputType, event:string): void{
        if (inputType == InputType.MouseDown){
            if(this.currentState() == States.Hover){
                this.current = States.Pressed;
                this.pressedstate();
                
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
        
        
    }
    private pressedout(){}
}
export {Progressbar}