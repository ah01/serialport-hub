const SerialPort = require('serialport');
const readline = require('readline');

const logger = require('./logger.js');

// ---

const ports = [];

function openPort(name) 
{
    let firstError = true;

    let port = new SerialPort(name, {
        baudRate: 9600
    });

    function schedulePortOpen() {
        setTimeout(() => port.open(), 500);
    }

    port.on("error", err => {
        logger[firstError ? "error" : "trace"](`Fail to open port ${name}`);
        schedulePortOpen();
        firstError = false;
    });

    port.on("open", () => {
        logger.info(`Port ${name} opend`);
        firstError = false;
    })

    port.on("close", (err) => {
        logger.error(`Port ${name} closed`);
        schedulePortOpen();
    });

    let rl = readline.createInterface(port);

    rl.on("line", line => {
        reSend(line, port);
    });

    ports.push(port);
}

function reSend(message, sourcePort) 
{
    logger.msg(sourcePort.path, message);

    ports.forEach((port) => {
        if (port != sourcePort) 
        {
            port.write(message + "\r\n");
        }
    });
}

function run(listOfPorts)
{
    listOfPorts.forEach(port => {
        openPort(port);
    });
}

function list() 
{
    SerialPort.list().then((l) => {
        l.forEach((p) => console.log(p.comName));
    })
}

exports.run = run;
exports.list = list;