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


transformString = (str) => {
    return str.replace(/\s*/g, ``)
}

parse = (str) => {
    str = transformString(str)
        .split("(").join("\\(")
        .split(")").join("\\)")
        .split("[").join("\\[")
        .split("]").join("\\]")
        .split(".").join("\\.")

    return "^" + str.split("<%=args%>").join("(.*)") + "$";
}


class Instruction {
    constructor(str) {
        this.instructions = {};
        this.str = transformString(str);
        this.regex = "";
    }

    if(regex) {
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
        let args = [];
        let m;
        if ((m = regex.exec(this.str)) !== null) {
            m.forEach((match, groupIndex) => {
                if (groupIndex) args.push(match)
            });
            return tmpl(prompt, {
                args: args
            });
        }
    }
}


let instruction = new Instruction(fs.readFileSync('./palindrom.java', 'utf8'));


instruction.if(`

import <%=args%>;

class <%=args%>{

  public static void main(<%=args%>) {

    int a = Integer.parseInt(<%=args%>);

    for(<%=args%>;<%=args%>;<%=args%>){
      System.out.println(i);
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
`);

prompt = instruction.prompt();
eval(prompt)
