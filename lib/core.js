const SerialPort = require('serialport');
const readline = require('readline');
const net = require('net');

const logger = require('./logger.js');

// ---

const ports = [];

function openPort(name) 
{
    let firstError = true;

    let port = new SerialPort(name, {
        baudRate: 9600
    });

    port.name = name;

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
    logger.msg(sourcePort.name, message);

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

function runTcpServer(tcpPort)
{
    var srv = net.createServer();

    srv.on("connection", socket => {

        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        logger.info("New client " + socket.name);

        ports.push(socket);

        let rl = readline.createInterface(socket);

        rl.on("line", line => {
            reSend(line, socket);
        });

        socket.on("close", (err) => {
            logger.error(`Client ${socket.name} close connection`);
            ports.splice(ports.indexOf(socket), 1);
        })

        socket.on("error", (err) =>{
            console.log("Error " + err);
        })
    });

    srv.listen(tcpPort);

    logger.info(`TCP Server listening on port ${tcpPort}`);
}

function list() 
{
    SerialPort.list().then((l) => {
        l.forEach((p) => console.log(p.comName));
    })
}

exports.run = run;
exports.runTcpServer = runTcpServer;
exports.list = list;