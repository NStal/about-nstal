var WebSocketServer = require("ws").Server;
var SyncWorker = require("./syncWorker").SyncWorker;
var settings = require("../localshare/settings").settings;
var World = require("./serverWorld").ServerWorld;
var Static = require("./share/static").Static;
var server = new WebSocketServer({
    host:settings.host
    ,port:settings.port
});
console.log("listen",{
    host:settings.host
    ,port:settings.port
});
var world = new World();
world.start();
server.on("connection",function(ws){
    console.log(world.gateway)
    Static.gateway.onConnect(new SyncWorker(ws).start());
})
//Server:
//1.Configure the world,give it some imformations
//2.Setup webSocketServer and distribute the comming client to the world