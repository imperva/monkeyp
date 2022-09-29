#!/usr/local/bin/node

const fs = require("fs");
const nodeModule = require('module');

const version = "0.1.0";
const orgRequire = nodeModule.prototype.require;

let js_file = process.argv[2],
    args = [],
    only_cp = false,
    only_fs = false,
    verbose = false,
    help_str = "Usage: node monkeyp.js <js_file>\n--only-cp      Only include logs related to the child_process module\n--only-fs      Only include logs related to the fs module\n-v,--verbose   Verbose mode will print all the full arguments passed to the monitored functions\n--args         All remaining arguments are passed in argv to the loaded NodeJS application\n--version      Show version number and quit\n-h,--help      Show this help";;

if (!js_file) {
    console.log(help_str);
    process.exit(1);
}

if (!fs.existsSync(js_file)) {
    console.log(`[-] File "${js_file}" does not exist, try "node monkeyp.js -h" for help`);
    process.exit(1);
}

let remove = [2];
process.argv.forEach((arg, i) => {
    arg = arg.toString().trim().toLowerCase();
    switch (arg) {
        case "--args":
            remove.push(i);
            args = process.argv.slice(i + 1);
            break;
        case "--only-cp":
            only_cp = true;
            remove.push(i);
            break;
        case "--only-fs":
            only_fs = true;
            remove.push(i);
            break;
        case "-v":
        case "--verbose":
            verbose = true;
            remove.push(i);
            break;
        case "--version":
            console.log(version);
            process.exit(0);
        case "-h":
        case "--help":
            console.log(help_str);
            process.exit(1);
    }
});

// Remove the arguments we parsed
remove.reverse().forEach(i => process.argv.splice(i, 1));

if (only_cp && only_fs) {
    console.log("[-] Only one of --only-cp or --only-fs can be specified.");
    process.exit(1);
}

nodeModule.prototype.require = function () {
    let module = arguments[0];
    let resolvedModule = orgRequire.apply(this, arguments);
    let methods = [];

    switch (module) {
        case "fs":
            if (!only_cp) {
                methods = ["readFileSync", "writeFileSync", "readdirSync", "readdir", "readFile", "writeFile", "existsSync", "exists"];
            }
            break;
        case "child_process":
            if (!only_fs) {
                methods = ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync'];
            }
            break;
    }

    for (let method of methods) {
        let methodRef = resolvedModule[method];
        resolvedModule[method] = function () {
            let args = Array.from(arguments).map(JSON.stringify).map(str => {
                str = str + "";
                if (!verbose && str.length > 700) {
                    return str.substring(0, 700) + "...";
                }
                return str;
            });

            console.log(`[+] ${module}.${method}(${args})`)

            return methodRef.apply(methodRef, arguments);
        }
    }

    return resolvedModule;
};

// prepare the process arguments
process.argv = [process.argv[0], js_file, ...args];

require(js_file);