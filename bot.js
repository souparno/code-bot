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

class Variables {
    constructor() {
        this.names = [];
    }

    get() {
        return this.names.shift();
    }

    set(name) {
        this.names.push(name);
    }
}

format = (str) => {
    return str
        .replace(/([.,;()[\]{}<>=+\/!%*-])/g, ` $1 `)
        .replace(/\n/g, ` `)
        .replace(/(\s)*/g, `$1`)
        .trim()
}

parse = (str, variables) => {
    str = format(str)
        .split("(").join("\\(")
        .split(")").join("\\)")
        .split("[").join("\\[")
        .split("]").join("\\]")
        .split(".").join("\\.")

    for (var key in (str = str.split("% >"))) {
        let m;

        if ((m = /< % =(.*)/g.exec(str[key]))) variables.set(m[1].trim());

        str[key] = str[key].replace(/< % =.*/g, `(.*)`);
    }

    return new RegExp("^" + str.join('') + "$");
}

dataObj = (obj, key, val) => {
    let m;
    if ((m = /(.*)\s\\\[\s(.*)\s\\\]/g.exec(key)) !== null) {
        if (!obj[m[1]]) obj[m[1]] = new Array()
        obj[m[1]][m[2]] = val;

        return;
    }

    obj[key] = val;
}

class Instruction {
    constructor() {
        this.instructions = [];
    }

    if (regex) {
        this.regex = regex;

        return this;
    }

    then(prompt) {
        for (var index in this.regex) {
            let variables = new Variables();

            this.instructions.push({
                regex: parse(this.regex[index], variables),
                variables: variables,
                prompt: prompt
            });
        }

        return this;
    }

    prompt(str) {
        for (var key in this.instructions) {
            var p = this.run({
                str: format(str),
                regex:  this.instructions[key].regex,
                prompt:  this.instructions[key].prompt,
                variables:  this.instructions[key].variables
            })

            if (p) return p;
        }

        return null;
    }

    run(data) {
        let m;
        let obj = {};

        if ((m = data.regex.exec(data.str)) !== null) {
            m.forEach((match, groupIndex) => {
                if (groupIndex) {
                    match = match.replace(/\s*([.,;()[\]{}<>=+\/!%*-])\s*/g, `$1`);

                    dataObj(obj, data.variables.get(), match);
                }
            });

            return tmpl(data.prompt, obj);
        }
    }
}

module.exports = new Instruction();
