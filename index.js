const fs = require("fs");
const minimist = require('minimist');

const core = require("./lib/core.js");
const logger = require("./lib/logger.js");

const args = minimist(process.argv.slice(2), {
    boolean: ["v", "h", "l"],
    alias: {
        "h": "help",
        "v": "verbose",
        "l": "list"
    }
});

if (args.help) 
{
    console.log(fs.readFileSync("help.txt", {encoding: "utf8"}));
    
    let package = require("./package.json");
    console.log(`\nVersion: ${package.version}`);

    return;
}

logger.verbose = args.verbose;

if (args.list) {
    core.list();
    return;
}

if (args._.length == 0 && args.tcp === undefined) 
{
    logger.error("No port to open");
    return;
}

core.run(args._);

if (args.tcp !== undefined) 
{
    core.runTcpServer(args.tcp);
}

process.on('SIGTERM', function () {
    process.exit(0);   
});
