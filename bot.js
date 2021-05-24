const fs = require('fs');

tmpl = (str, data) => {
    var fn = "(function (obj){var p=[];with(obj){p.push('" +
        str
        .replace(/[\r\t\n]/g, " ")
        .replace(/'/g, "\\'")
        .replace(/<%=(.*?)%>/g, "',$1,'") +
        "');}return p.join('');})";

    return eval(fn)(data);
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

format = (str) => {
    return str
        .replace(/([.,;()[\]{}<>=+\/!%*-])/g, ` $1 `)
        .replace(/[\r\t\n]/g, ` `)
        .replace(/(\s)*/g, `$1`)
        .trim()
}

parse = (str, variables) => {
    str = str
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
