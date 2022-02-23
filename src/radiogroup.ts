import { NumberAlias } from "@svgdotjs/svg.js";
import {Window, Widget, WidgetState, IWidgetStateEvent,States,InputType} from "./core";
// importing code from SVG.js library
import {SVG, Svg, G, Rect, Container, Text, Box, Circle} from "./core";
class RadioButton extends Widget{
    private _circle: Circle;
    private _group: G;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private defaultFontSize: number = 18;
    private defaultWidth: number = 25;
    private _checked:boolean;
    constructor(parent:Window){
        super(parent);
        // set defaults
        //this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = "radio";
        this._fontSize = this.defaultFontSize;
        this._checked = false;
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
  
    render():void{
        this._group = this.parent.window.group();
        this._circle = this._group.circle(this.width);
        this._circle.stroke("#9F93E5");
        this._circle.fill("transparent");
        this._text = this._group.text(this._input);
        this._text.font({
            fill:"black",
            family: "Arial"
        });

        // Add a transparent rect on top of text to prevent selection cursor
        this._group.circle(this.width, this.height).opacity(0);
       
        this.backcolor = "transparent";
        this.registerEvent(this._group);
        this.registerEvent(this._circle);
    }
    get circleX():NumberAlias{
        return this._circle.x();
    }
    get circleY():NumberAlias{
        return this._circle.y();
    }
    private positionText(){
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._circle.y() + ((+this._circle.height()/2)) - (box.height/2));
        this._text.x(+this._circle.x() + (+this._circle.width() + 2));
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    update(): void {
        if(this._text != null)
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();

       
    }
    transition(inputType:InputType, event:string): void{
        if (inputType == InputType.MouseDown){
            if(this.currentState() == States.Hover){
                this.current = States.Pressed;
                this.pressedstate();
                
                if(this._checked){
                    this.raise(inputType, event);
                    }
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
    get group():G{
        return this._group;
    }
    set text(text:string){
        this._input = text;
        this.update();
    }
    set checked(c:boolean){
        this._checked = c;
        if(this._checked){
            this._circle.fill("#9F93E5");
            }else{
                this._circle.fill("transparent")
            }
    }
    private pressedstate(){
        //this.backcolor = "silver";
        
       
       // this._text.dx(0.5);
        this._checked = true;
        if(this._checked){
        this._circle.fill("#9F93E5");
        }
    }
    private pressrelease(){
        
    }
    private idleupstate(){
        //this.backcolor = "transparent";
        if(this._checked){
            this._circle.fill("#9F93E5");
        }
    }
    private hoverstate(){
        //this.backcolor = "lightgray";
    }
}

class RadioGroup extends Widget{
    private _circle: Circle;
    private _group: G;
    private _btns: RadioButton[];
    private _text: Text;
    private _inputs: string[];
    private _fontSize: number;
    private _text_x:number;
    private _text_y:number;
    private _y: number;
    private _x: number;
    private defaultText: string= "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 30;
    private defaultHeight: number = 30;
    private defaultInputs: string[] = ["radio 1","radio 2","radio 3"];
    private _n:number;
    constructor(parent:Window){
        super(parent);
        // set defaults
        //this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._inputs = this.defaultInputs;
        this._fontSize = this.defaultFontSize;
        this._n = 1;
       //this._x = 150;
        //this._y = 250;
        this._btns = [];

        // render widget
        this.render();
        // set default or starting state
        this.idleupstate();
    }
    get n():number{
        return this._n;
    }
    set n(newN:number){
    this._n = newN;

    for(let i = 0; i<this._btns.length;i++){
        //onsole.log(this._btns[i].circleX);
        if(i!=this._n-1){
            this._btns[i].checked = false;
        }
    }
    this._btns[this._n-1].checked = true;
    }
    move(x: number, y: number): void {
        if(this._group != null)
            this._group.move(x,y);
            this._x = x;
            this._y = y;
             
            this.update();
    }
    stateChanged(e:Event,index:number): void{
        //console.log("index"+i);
        this._n = index;
        for(let i = 0; i<this._btns.length;i++){
            //onsole.log(this._btns[i].circleX);
            if(i!=index){
                this._btns[i].checked = false;
            }
        }
    }
    render(): void {
        this._group = this.parent.window.group();
        
       
        for(let i = 0; i<this._inputs.length;i++){
        let radio = new RadioButton(this.parent);
        radio.move(Number(this._group.x()),Number(this._group.y())+i*(this.width+2));
        radio.text = this._inputs[i];
        if(i == this._n-1){
            radio.checked = true;
        }
        radio.stateEvent().attach((input, event)=>{
            //test_text.text("Button was clicked");
            //console.log(this);
           
            this.stateChanged(event,i);
            

        
        });
        this._btns.push(radio);
        this._group.add(radio.group);
        }
        
        // Add a transparent rect on top of text to prevent selection cursor
       // this._group.circle(this.width, this.height).opacity(0);
       
        this.backcolor = "transparent";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._group);
        //this.registerEvent(this._rect);
    }
    private positionText(){
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._circle.y() + ((+this._circle.height()/2)) - (box.height/2));
        this._text.x(+this._circle.x() + (+this._circle.width() + 2));
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    update(): void {
        if(this._text != null)
            //this._text.font('size', this._fontSize);
            //this._text.text(this._inputs[0]);
           // this.positionText();
           for(let i = 0; i<this._inputs.length;i++){
            let radio = this._btns[i];
            radio.move(Number(this._group.x()),Number(this._group.y())+i*(this.width+2));
            radio.text = this._inputs[i];
            if(i == this._n-1){
                radio.checked = true;
            }
            radio.stateEvent().attach((input, event)=>{
                //test_text.text("Button was clicked");
                //console.log(this);
               
                this.stateChanged(event,i);
                
    
            
            });
           // this._btns.push(radio);
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
        
       
        
    }
    private idleupstate(){
        //this.backcolor = "transparent";
        
    }
    private pressrelease(){
        
    }
    
    private hoverstate(){
        //this.backcolor = "lightgray";
    }
}
export {RadioGroup}