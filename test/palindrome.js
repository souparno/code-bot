
let instruction = require("../bot")

// instruction.if(``).then(`

//   console.log("Let's start off with creating a class"); 
// `);


// instruction.if(`

// class <%=args[0]%>{
  
// }

// `).then(`

// var classname = "<%=args[0]%>";

// if(classname) console.log("That's Great you declared a class called " + classname);

// if(classname && classname != "Palindrome") console.log("Can you now name your class as Palindrome ?");

// if(classname && classname == "Palindrome") console.log("lets now create a public non-returntype method called main");
// `);


instruction.if(`

class <%=args[0]%>{
      <%=args[1]%> (){
   
  }
 }
`).then(`

  if("<%=args[1]%>" == "public static void main"){
    console.log("what! you did that! awesome, now lets try to create a array type string parameter for the main method");
  }

  if("<%=args[1]%>" == "public void main"){
    console.log("thats great, now add a static keyword after public and we are good to go");
  }

`)

instruction.if(`
  class Palindrome{

  public static void main(<%=args[0]%>){
    
  }

 }

`).then(`
console.log("I am here");
   console.log("<%=args[0]%>");
`)


let prompt = instruction.prompt(`

class Palindrome{
 public static void main(){
   
 } 
}

`)


eval(prompt)
