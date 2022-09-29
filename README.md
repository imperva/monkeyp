# monkeyp

An extremely simple dynamic analysis utility for analyzing Node JS applications.

## Usage

```
Usage: node monkeyp.js <js_file>
--only-cp      Only include logs related to the child_process module
--only-fs      Only include logs related to the fs module
-v,--verbose   Verbose mode will print all the full arguments passed to the monitored functions
--args         All remaining arguments are passed in argv to the loaded NodeJS application
--version      Show version number and quit
-h,--help      Show this help
```

## Example

Using monkeyp to analaze the next CLI.

```
$: node monkeyp.js ./node_modules/.bin/next --only-cp
warn  - Port 3000 is in use, trying 3001 instead.
ready - started server on 0.0.0.0:3001, url: http://localhost:3001
event - compiled client and server successfully in 552 ms (159 modules)
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
[+] child_process.execSync("git config --local --get remote.origin.url",{"timeout":1000,"stdio":"pipe"})
```

Using monkeyp to analaze snyk CLI.

```
$: node monkeyp.js $(which snyk) --only-cp --args test
[+] child_process.spawn("git",["remote","get-url","origin"],{"shell":true})
[+] child_process.spawn("git",["rev-parse","--abbrev-ref","HEAD"],{"shell":true})

Testing /Users/john/Desktop/demo...

✔ Tested 24 dependencies for known issues, no vulnerable paths found.
```
