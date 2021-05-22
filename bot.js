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

transform = (str) => {
    return str
        .replace(/([.,;()[\]{}<>=+\/!%*-])/g, ` $1 `)
        .replace(/(\s)*/g, `$1`)
        .replace(/\n/g, ``)
        .trim()
}

parse = (str, extract) => {
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
    constructor() {
        this.instructions = {};
    }

    if (regex) {
        this.regex = regex;

        return this;
    }

    then(prompt) {
        for (var index in this.regex) {
            let extract = new Extract();
            let regex = parse(this.regex[index], extract);

            this.instructions[regex] = [extract, prompt];
        }

        return this;
    }

    prompt(str) {
        this.str = transform(str);

        for (var regex in this.instructions) {
            var p = this.run(new RegExp(regex), this.instructions[regex][1], this.instructions[regex][0])
            if (p) return p;
        }

        return null;
    }

    run(regex, prompt, extract) {
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

module.exports = new Instruction();
