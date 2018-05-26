const colors = require('colors');

exports.verbose = false;

exports.trace = function (msg) {
    if (!exports.verbose) return;

    console.log(("T\t" + msg).grey);
}

exports.info = function (msg) {
    console.log("INFO".green + "\t" + msg);
}

exports.error = function (msg) {
    console.log("ERROR".red + "\t" + msg);
}

exports.msg = function (who, msg) {
    console.log(who.cyan + "\t" + msg);
}

exports.log = function (who, msg) {
    console.log(who.cyan + "\t" + msg.grey);
}