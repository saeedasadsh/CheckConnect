var net = require("net");
var http = require('http');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "kingofmeta_adok",
    password: "NTGePf_Pnn%N",
    database: "kingofmeta_ADok"
});

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

var server = net.createServer();
var StringDecoder = require('string_decoder').StringDecoder;

//var _ip = "94.130.122.236";
var _ip = "188.253.2.147";

var _port = 3020;

var Players = [];

try {
    var decoder = new StringDecoder('utf8');
    server.on('connection', function (socket) {
        console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
        var myId = -1;

        socket.on('data', function (data) {
            if (data && data.byteLength != undefined) {
                data = new Buffer(data).toString('utf8');
            }

            var dt = JSON.parse(data);
            var playerId = dt.playerId;
            var apiKey = dt.apiKey;
            var appId = "";
            var query = "select id from apps where apiKey= '" + apiKey+"'";
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                result.forEach((row) => {
                    appId = row.appId;
                });
            });

            var myData = {
                playerId: playerId, apiKey: apiKey, socket: socket, appId: appId
            };

            if (Players[appId] == undefined) {

                Players[appId] = { players: [] };
                Players[appId].players[playerId] = myData;
                var data = {
                    result: "1"
                };
                socket.write(JSON.stringify(data));
            }
            else
            {
                if (Players[appId].players[playerId] == undefined) {
                    Players[appId].players[playerId] = myData;
                    var data = {
                        result: "1"
                    };
                    socket.write(JSON.stringify(data));
                }
                else
                {
                    if (Players[appId].players[playerId].socket == undefined) {
                        Players[appId].players[playerId] = myData;
                        var data = {
                            result: "1"
                        };
                        socket.write(JSON.stringify(data));
                    }
                    else
                    {
                        var data = {
                            result: "3"
                        };
                        socket.write(JSON.stringify(data));
                    }
                }
            }
        });

        socket.on('disconnect', function (data) {

        });

    });

    server.listen(_port, _ip);
}
catch (e) {
    console.log("6: " + e.message);
}