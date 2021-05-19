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
        "<import-name>": VARIABLE
    }

    return (str) => {

        str = "^" + ('\n' + str)
            .replace(/([\.\;\(\)\[\]\{\}\=\n])/g, ` $1 `)
            .split(" ").join("\\s*")
            .split("\n").join("\\n*")
            .split("(").join("\\(")
            .split(")").join("\\)")
            .split("[").join("\\[")
            .split(".").join("\\.")

            // https://stackoverflow.com/a/55636681/2481350
            // substituting multiple \s*\s* with \s*, similarly \n*\n* with \n*
            .replace(/(...)\1+/g, '$1')

            // substituting multiple \s*\n*\s*\n*with \s*\n*
            .replace(/(......)\1+/g, '$1')

        for (var tag in tags) {
            str = str.split(tag).join(tags[tag])
        }

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
class <class-name>{

  public static void main(String <variable-name>[]){

    int <variable-name> = Integer.parseInt(<variable-name>[0]);

  }

}
`), `console.log("Thats great, let's try to import java.lang.Math package;")`);


instruction.add(parse(`
import <import-name>;

class <class-name>{

  public static void main(String <variable-name>[]){
 
    int <variable-name> = Integer.parseInt(<variable-name>[0]);

  }

}
`), `
  p = "<%=args[0]%>" == "java.lang.Math"? "You are doing great ! now, can you try and extract the no.s in reverse order ?": "oops! thats a wrong package name."; 
  console.log(p);
  `)


prompt = instruction.prompt();
eval(prompt)
