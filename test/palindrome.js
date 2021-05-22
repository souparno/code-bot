
let instruction = require("../bot")

instruction.if(``).then(`

  console.log("Let's start off with creating a class"); 
`);


instruction.if(`

class <%=args[0]%>{
  
}

`).then(`

var classname = "<%=args[0]%>";

if(classname) console.log("That's Great you declared a class called " + classname);

if(classname && classname != "Palindrome") console.log("Can you now name your class as Palindrome ?");

if(classname && classname == "Palindrome") console.log("lets now create a public non-returntype method called main");
`);


instruction.if(`

class <%=args[0]%>{
      <%=args[1]%> (){
   
  }
 }
`).then(`
  if("<%=args[1]%>" == "public static void main"){
    console.log("what! you did that! awsome, let's now try to declare a varibale and put some number in it");
  }

  if("<%=args[1]%>" == "public void main"){
    console.log("thats great, now add a static keyword after public and we are good to go");
  }

`)

let prompt = instruction.prompt(`

class Palindrome{
 public static void main(){
   
 } 
}

`)


eval(prompt)
