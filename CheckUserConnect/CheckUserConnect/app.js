﻿var net = require("net");
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
        var playerId = "";
        var apiKey = "";
        var knd = "";
        var dui = "";
        var appId = "";

        socket.on('data', function (data) {
            if (data && data.byteLength != undefined) {
                data = new Buffer(data).toString('utf8');
            }

            console.log(data);

            var dt = JSON.parse(data);
             playerId = dt.playerId;
             apiKey = dt.apiKey;
             knd = dt.kind;
             dui = dt.dui;
             appId = "";

            if (knd == "Add") {
                var query = "select id from apps where apiKey= '" + apiKey + "'";
                con.query(query, function (err, result, fields) {
                    if (err) throw err;
                    result.forEach((row) => {
                        appId = row.appId;
                    });
                });

                var myData = {
                    playerId: playerId, apiKey: apiKey, socket: socket, appId: appId, alive: Date.now(), dui: dui
                };
                console.log(Players[appId]);
                if (Players[appId] == undefined) {
                    console.log("1");
                    Players[appId] = { players: [] };
                    Players[appId].players[playerId] = myData;
                    var data = {
                        result: "1"
                    };
                    console.log(data);

                    socket.write(JSON.stringify(data) + "\n");
                }
                else {
                    if (Players[appId].players[playerId] == undefined) {
                        console.log("2");
                        Players[appId].players[playerId] = myData;
                        var data = {
                            result: "1"
                        };
                        socket.write(JSON.stringify(data) + "\n");
                    }
                    else {
                        console.log("3");
                        if (Players[appId].players[playerId].socket == undefined) {
                            Players[appId].players[playerId] = myData;
                            var data = {
                                result: "1"
                            };
                            socket.write(JSON.stringify(data) + "\n");
                        }
                        else {
                            if (Players[appId].players[playerId].dui != dui) {
                                console.log("4");
                                var data = {
                                    result: "3"
                                };
                                socket.write(JSON.stringify(data) + "\n");
                            }
                            else {
                                Players[appId].players[playerId] = myData;
                                var data = {
                                    result: "1"
                                };
                                socket.write(JSON.stringify(data) + "\n");
                            }
                        }
                    }
                }
            }
            else if (knd == "Alive") {
                var data = {
                    alive: true, Meskind: "Alive"
                };
                for (var j = 0; j < pkgs.length; j++) {
                    if (Players[appId] != undefined) {
                        if (Players[appId].players[playerId] != undefined) {
                            Players[appId].players[playerId].alive = Date.now();
                        }
                    }
                }
                socket.write(JSON.stringify(data) + "\n");
            }
            else
            {
                socket.destroy();
            }
        });

        socket.on('disconnect', function (data) {
            console.log("disconnect in dis: " + playerId);
        });

        socket.on('close', function (data) {
            try {
                console.log("disconnect in close: " + playerId);
            }
            catch (e) {
                console.log("4: " + e.message);
            }
        });

    });

    server.listen(_port, _ip);
}
catch (e) {
    console.log("6: " + e.message);
}