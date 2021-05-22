const fs = require('fs');


// Simple JavaScript Templating
// John Resig - https://johnresig.com/ - MIT Licensed
(function() {

    this.tmpl = function tmpl(str, data) {
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        var fn = new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") +
            "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();


transform = (str) => {
    return str
        .replace(/([.,;()[\]{}<>=+\/!%*-])/g, ` $1 `)
        .replace(/(\s)*/g, `$1`)
        .replace(/\n/g, ``)
}


class Extract {
    constructor() {
        this.arr = [];
    }

    get() {
        return this.arr;
    }

    shift() {
        return this.arr.shift();
    }

    set(regex, str) {
        let m;
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex) this.arr.push(match)
            });
        }

        return str;
    }
}

let extract = new Extract();

parse = (str) => {
    str = transform(str)
        .split("(").join("\\(")
        .split(")").join("\\)")
        .split("[").join("\\[")
        .split("]").join("\\]")
        .split(".").join("\\.")

    let regex = /<\s%\s=\sargs\s\\\[\s([0-9]*)\s\\]\s%\s>/g;

    return ("^" + extract.set(regex, str) + "$")
        .replace(regex, `(.*)`);
}

class Instruction {
    constructor(str) {
        this.instructions = {};
        this.str = transform(str);
        this.regex = "";
    }

    if (regex) {
        this.regex = parse(regex);

        return this;
    }

    then(prompt) {
        this.instructions[this.regex] = prompt;

        return this;
    }

    prompt() {
        for (var regex in this.instructions) {
            var p = this.run(new RegExp(regex), this.instructions[regex])
            if (p) return p;
        }

        return null;
    }

    run(regex, prompt) {
        let m;
        let args = new Array(extract.get().length);
        if ((m = regex.exec(this.str)) !== null) {
            m.forEach((match, groupIndex) => {
                if (groupIndex) {
                    match = match.replace(/\s*([.,;()[\]{}<>=+\/!%*-])\s*/g, `$1`);
                    args[extract.shift()] = match;
                }
            });

            return tmpl(prompt, {
                args: args
            });
        }
    }
}


let instruction = new Instruction(`


import java.io.*;

class Palindrome{

  public static void main(String args[]) {

    int a = Integer.parseInt(args[0], b, c);

    for(int i =0;i<=10; i++){
      System.out.println(i);
    }
  }


}

`);

instruction.if(`

import <%=args[0]%>;

class <%=args[1]%>{

  <%=args[13]%> <%=args[14]%> <%=args[12]%> main(<%=args[2]%>) {

    <%=args[11]%> <%=args[15]%> = <%=args[7]%>(<%=args[3]%>);

    <%=args[10]%>(<%=args[4]%>;<%=args[5]%>;<%=args[6]%>){
      <%=args[8]%>(<%=args[9]%>);
    }
  }

}
`).then(`

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

eval(instruction.prompt());
