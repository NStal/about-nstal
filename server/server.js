var WebSocketServer = require("ws").Server;
var settings = require("./localshare/settings").settings;
//Server:
//1.Configure the world,give it some imformations
//2.Setup webSocketServer and distribute the comming client to the world
Interface.getGalaxyInfoWithEnvironment(name,function(galaxy){
    
    var __config = {time:0//Date.now()
		    ,galaxy:galaxy
		    ,rate:settings.rate
		   }
    var world = new (require("./serverWorld").ServerWorld)(__config);
    settings.port = galaxy.server.port;
    settings.host = galaxy.server.host;
    settings.localport = galaxy.server.localport;
    world.init();
    world.start();
    new God().watch(world);
    //init server
    var server = new WebSocketServer({
	host:settings.host
	,port:settings.port
    });
    server.on("connection",function(ws){
	world.syncManager.addClient(ws);
    });
    var localServer = new WebSocketServer({
	host:settings.host
	,port:settings.localport
    })
    localServer.on("connection",function(ws){
	console.log("recieve local connection");
	//INCOMPLETE
	ws.close();
    })
})