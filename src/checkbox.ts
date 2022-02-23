import {Window, Widget, WidgetState, IWidgetStateEvent,States,InputType} from "./core";
// importing code from SVG.js library
import {SVG, Svg, G, Rect, Container, Text, Box} from "./core";
class Checkbox extends Widget{
    private _rect: Rect;
    private _group: G;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 30;
    private defaultHeight: number = 30;
    private checked:boolean;
    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this.checked = false;
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
    private positionText(){
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + (+this._rect.width() + 2));
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    render(): void {
        this._group = this.parent.window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("#9F93E5");
        this._text = this._group.text(this._input);
        this._text.font({
            fill:"black",
            family: "Arial"
        });

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
        if(this._text != null)
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();

        if(this._rect != null)
            this._rect.fill(this.backcolor);
    }
    set text(text:string){
        this._input = text;
        this.update();
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
    private pressedstate(){
        //this.backcolor = "silver";
        
       
        this._text.dx(0.5);
        this.checked = !this.checked;
        if(this.checked){
        this._rect.fill("#9F93E5");
        
        }else{
            this._rect.fill("transparent")
        }
    }
    private pressrelease(){
        
    }
    private idleupstate(){
        //this.backcolor = "transparent";
        if(this.checked){
            this._rect.fill("#9F93E5");
        }
    }
    private hoverstate(){
        //this.backcolor = "lightgray";
    }
}   
export {Checkbox}