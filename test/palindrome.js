
let instruction = require("../bot")

instruction.if([``]).then(`

  console.log("Let's start off with creating a class"); 
`);


instruction.if([`

class <%=args[0]%>{
  
}

`]).then(`

var classname = "<%=args[0]%>";

if(classname) console.log("That's Great you declared a class called " + classname);

if(classname && classname != "Palindrome") console.log("but, Can you now name your class as Palindrome ?");

if(classname && classname == "Palindrome") console.log("let's now create a public non-returntype method called main");
`);


instruction.if([`

class <%=args[0]%>{
      <%=args[1]%> (){
   
  }
 }
`]).then(`

  if("<%=args[1]%>" == "public static void main"){
    console.log("what! you did that! awesome, now let's try to create a array type string parameter for the main method");
  }

  if("<%=args[1]%>" == "public void main"){
    console.log("that's great, now add a static keyword after public and we are good to go");
  }

`)

instruction.if([`
  class <%=args[0]%>{

  public static void main(String <%=args[1]%>[]){
    
  }

 }
`,`
  class <%=args[0]%>{

  public static void main(String[] <%=args[1]%>){
    
  }

 }
`,
`  class <%=args[0]%>{

  public static void main(String []<%=args[1]%>){
    
  }

 }


`]).then(`
  console.log("<%=args[1]%>");
`)


let prompt = instruction.prompt(`

class Palindrome{

}

`)


eval(prompt)
