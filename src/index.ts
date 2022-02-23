import {Window} from "./core"
import {Button} from "./button"
import {Checkbox} from "./checkbox"
import {RadioGroup} from "./radiogroup"
import {Textbox} from "./textbox"
import {Progressbar} from "./progressbar"
import {Srcollbar} from "./scrollbar"
import {StarRating} from "./starrating";

let w = new Window('500','500');
// This just monitors events
w.attach(function(input, event){
   
     if(Object(event).type=="mousedown"){
         //console.log("bodypressed");
     }
   
})


// For testing, we'll create a text box and add it to the window
// to use for displaying button click messages

let test_text = w.window.group().text("Click  Button!").move(10,20);
test_text.font('size', 20);


let btn = new Button(w);
btn.text = "Button 1"
btn.fontSize = 20
btn.move(50, 150)
let checkbox = new Checkbox(w);
checkbox.text = "option1"
checkbox.move(50,200)
let checkbox2 = new Checkbox(w);
checkbox2.text = "option2"
checkbox2.move(50,240)
let radios = new RadioGroup(w);
 radios.move(200,200);
 radios.n = 2;
 let textbox = new Textbox(w);
 textbox.move(200,150);
 let progress = new Progressbar(w);
 progress.move(50,300);
 progress.value = 25;
 let scrollbar = new Srcollbar(w);
 scrollbar.move(460,22);
 let stars = new StarRating(w);
 stars.value = 2;
 stars.move(50,400);
 
// Attach anonymous function to state change event handler.
// button click event is raised by transition table of widget.
// You can attach as many functions as you want to each widget.
// this functionality is handled by Widget base class
btn.stateEvent().attach(function(input, event){
    test_text.text("Nice job! Now type something in the textbox");
    console.log(input);

});
textbox.attach(function(input,event){
   if(event=="submit"){
    test_text.text("you typed: "+textbox.value);
   }
});
stars.attach(function(input,event){
    if(event=="onChange"){
        test_text.text(stars.value+" Star(s)!");
       }
});
scrollbar.attach(function(input,event){
  if(event=="scrolldown"){
    test_text.text("scolling down");
  }
  if(event=="scrollup"){
    test_text.text("scolling up");
  }
  if(event=="idle"){
    test_text.text("idle...");
  }
});
