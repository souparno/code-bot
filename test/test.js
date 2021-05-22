let instruction = require("../bot")


instruction.if([`

import <%=args[0]%>;

class <%=args[1]%>{

  <%=args[13]%> <%=args[14]%> <%=args[12]%> main(<%=args[2]%>) {

    <%=args[11]%> <%=args[15]%> = <%=args[7]%>(<%=args[3]%>);

    <%=args[10]%>(<%=args[4]%>;<%=args[5]%>;<%=args[6]%>){
      <%=args[8]%>(<%=args[9]%>);
    }
  }

}
`]).then(`

 console.log("<%=args[0]%>");
 console.log("<%=args[1]%>");
 console.log("<%=args[2]%>");
 console.log("<%=args[3]%>");
 console.log("<%=args[4]%>");
 console.log("<%=args[5]%>");
 console.log("<%=args[6]%>");
 console.log("<%=args[7]%>");
 console.log("<%=args[8]%>");
 console.log("<%=args[9]%>");
 console.log("<%=args[10]%>");
 console.log("<%=args[11]%>");
 console.log("<%=args[12]%>");
 console.log("<%=args[13]%>");
 console.log("<%=args[14]%>");
 console.log("<%=args[15]%>");
`);


let prompt = instruction.prompt(`

import java.io.*;

class Palindrome{

  public static void main(String args[]) {

    int a = Integer.parseInt(args[0], b, c);

    for(int i =0;i<=10; i++){
      System.out.println(i);
    }
  }


}

`)

eval(prompt);
