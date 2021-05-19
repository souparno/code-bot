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

parse = (() => {
    const VARIABLE = "(.*)"

    const tags = {
        "<class-name>": VARIABLE,
        "<function-name>": VARIABLE,
        "<variable-name>": VARIABLE,
        "<import-name>": "import\s*" + VARIABLE
    }

    return (str) => {
        str = "^" + str.split(" ").join("\\s*")
            .split("\n").join("\\n*")
            .split("(").join("\\(")
            .split(")").join("\\)")
            .split("[").join("\\[")
            .split(".").join("\\.")
            .replace(/(...)\1+/g, '$1')

        for (var tag in tags) {
            str = str.split(tag).join(tags[tag])
        }

        // return new RegExp(str)
        return str;
    }
})()


class Instruction {
    constructor(str) {
        this.instructions = {};
        this.str = str;

    }

    add(regex, prompt) {
        this.instructions[regex] = prompt;
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


instruction.add(parse(`
  class <class-name> {

    public static void main ( String <variable-name> [ ] ) {
       
      int <variable-name> = Integer . parseInt ( <variable-name> [ 0 ] );
        
    }

  }
`), "Thats great, let's try to import java.lang.Math package;");

instruction.add(parse(`

  import java.lang.Math;

  class <class-name> {

    public static void main ( String <variable-name> [ ] ) {
       
      int <variable-name> = Integer . parseInt ( <variable-name> [ 0 ] );
        
    }

  }
`), "You are doing great, now can you extract the no.s in reverse order?. Thats right you will need a loop");


console.log(instruction.prompt());
