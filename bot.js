const fs = require('fs');

tmpl = (str, data) => {
    let fn = "(function (obj){var p=[];with(obj){p.push('" +
        str
        .replace(/[\r\t\n]/g, " ")
        .replace(/'/g, "\\'")
        .replace(/<%=(.*?)%>/g, "',$1,'") +
        "');}return p.join('');})";

    return eval(fn)(data);
}

format = (str) => {
    return str
        .replace(/([.,;()[\]{}<>=+\/!%*-])/g, ` $1 `)
        .replace(/[\r\t\n]/g, ` `)
        .replace(/(\s)*/g, `$1`)
        .trim()
}

parse = (str, variables) => {
    let regex = /<\s%\s=\s(.*?)\s%\s>/g;

    str = str
        .split("(").join("\\(")
        .split(")").join("\\)")
        .split("[").join("\\[")
        .split("]").join("\\]")
        .split(".").join("\\.")

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex) variables.set(match);
        });
    }

    return new RegExp("^" + str.replace(regex, '(.*)') + "$");
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

extract = (str, regex, variables) => {
    let m;

    if ((m = regex.exec(str)) !== null) {
        m.forEach((match, groupIndex) => {
            if (groupIndex) {
                match = match.replace(/\s*([.,;()[\]{}<>=+\/!%*-])\s*/g, `$1`);

                dataObj(variables, variables.get(), match);
            }
        });

        return variables;
    }
}

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
                regex: parse(format(this.regex[index]), variables),
                variables: variables,
                prompt: prompt
            });
        }

        return this;
    }

    prompt(str) {
        for (var key in this.instructions) {
            let instruction = this.instructions[key];
            let obj = extract(format(str), instruction.regex, instruction.variables)

            if (obj) return tmpl(instruction.prompt, obj);
        }
    }
}

module.exports = new Instruction();
