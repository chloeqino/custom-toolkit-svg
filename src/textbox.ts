// importing local code, code we have written
import {Window, Widget, WidgetState, IWidgetStateEvent,States,InputType} from "./core";
// importing code from SVG.js library
import {SVG, Svg, G, Rect, Container, Text, Box} from "./core";
class Textbox extends Widget{

    private _rect: Rect;
    private _group: G;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _caret: Rect;
    private _placeholder: Text;
    private _focused:boolean;
    private _text_x: number;
    private _viewbox: Svg;
    private defaultText: string= "";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 200;
    private defaultHeight: number = 30;
    constructor(parent:Window){
        super(parent);
        // set defaults
        
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this._focused = false;
        // render widget
        this.render();
        // set default or starting state
        this.idleupstate();
        this.parent.attach((input, event)=>{
             if(this._focused){
                 this.focusedstate();
             }
             
            if(Object(event).type=="mousedown"){
                //console.log("bodypressed from textbox");
             if(this.currentState()!=States.Pressed){
                 this.pressedout();
             }
            }     
          
       })
    }
    private positionText(){
        let box:Box = this._text.bbox();
        
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._caret.y((+this._rect.y() + ((+this._rect.height()/2)) - (this._fontSize/2)));
        this._text.x(+this._rect.x() + 4);
       this._caret.x(+this._rect.x()+box.width+5);
        if (this._text_y > 0){
            this._text.y(this._text_y);
            //this._caret.y(this._text_y+1);
        }
    }
    get value():string{
        return this._input;
    }
    move(x: number, y: number): void {
        if(this._group != null)
            this._group.move(x,y);
            this.update();
    }
    render(): void {
        this._group = this.parent.window.group();
        this._viewbox = SVG().addTo(this._group);
        
        this._viewbox.width(this.width);
        this._viewbox.height(this.height);
        this._rect = this._viewbox.rect(this.width, this.height);
        this._caret = this._viewbox.rect(1,this._fontSize);
        this._caret.attr("class","caret");
        this._placeholder = this._viewbox.text("type somthing here...");
        let box:Box = this._placeholder.bbox();
        this._placeholder.y(+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        
        this._placeholder.x(+this._rect.x() + 4);
        this._caret.fill("#e83e8c");
        this._caret.hide();
        this._rect.stroke("black");
        
        this._text = this._viewbox.text(this._input);
        this._text.font({
            fill:"black",
            family: "Arial"
        });
        this._placeholder.font({
            fill:"lightgray",
            family: "Arial"
        });

        // Add a transparent rect on top of text to prevent selection cursor
        this._group.rect(this.width, this.height).opacity(0);

        this.backcolor = "purple";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._group);
        this.registerEvent(this._rect);
        //this.registerEvent(this.parent);
      
    }

    update(): void {
        if(this._text != null)
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();

        if(this._rect != null)
            this._rect.fill(this.backcolor);
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
                //this.raise(inputType, event);
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
            }else if((this.currentState() == States.Hover)&&(!this._focused)){
                this.current = States.IdleUp;
                this.idleupstate();
            }else if(this.currentState() == States.Pressed){
                this.current = States.PressedOut;
                //this.pressedout();
            }
           
        }else if(inputType == InputType.KeyPress){
            //console.log(this._focused);
            if(this._focused){
                console.log(Object(event));
                if(Object(event).keyCode==8){
                    //backspace
                    this._input= this._input.slice(0,-1);
                }else if(Object(event).keyCode==20){
                    //do nothing 
                }else if(Object(event).keyCode==32){
                    //blankspce
                    this._input+=" ";
                }else if(Object(event).keyCode==13){
                    //enter 
                    this.raise(10,"submit");
                    this.pressedout();
                }
                else{
                this._input+=(Object(event).key);
                }
                this.update();
            }
        }
        // uncomment the following line for state change debug output in the console.
        //console.log("Widget: " + InputType[inputType] + " State: "+ States[this.currentState()]);
    }
    private hoverstate(){
       // this.backcolor = "lightgray";
    }
    private pressrelease(){
        this._rect.stroke("black");
       // this._text.dx(-0.5)
    }
    private focusedstate(){
        this._rect.stroke("#9F93E5");
        this._caret.show();
        this._placeholder.hide();
    }
    private hoverpressedstate(){

        this.backcolor = "lightgray";
    }
    private idleupstate(){
        this.backcolor = "transparent";
    }
    private idledownstate(){}
    private pressedstate(){
       // this.backcolor = "silver";
       this._rect.stroke("#9F93E5");
       // this._rect.stroke("silver");
        this._text.dx(0.5);
        this._focused = true;

    }
    private pressedout(){
        //console.log("pressed out");
        this.backcolor = "transparent";
        this._focused = false;
        this._rect.stroke("black");
        this._caret.hide();
        if(this._input.length<=0){
            this._placeholder.show();
        }
    }

}
export {Textbox};