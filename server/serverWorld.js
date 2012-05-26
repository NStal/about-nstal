(function(exports){
    var Static = require("./share/static").Static;
    var ServerWorld = require("./share/world").World.sub();
    var Items = require("./share/item").Items;
    var GameResourceManager = require("./share/item").GameResourceManager;
    var ServerGateway = require("./serverGateway").ServerGateway;
    var BattleFieldSimulator = require("./share/battleFieldSimulator").BattleFieldSimulator;
    
    var shipInfo = {
	cordinates:{x:100,y:100}
	,ability:{
	    maxSpeed:3
	    ,maxRotateSpeed:0.2
	    ,attack:100
	    ,range:50
	}
	,size:20
	,id:"1"
	,itemId:"2"
    }
    ServerWorld.prototype._init = function(){
	Static.battleField = new BattleFieldSimulator();
	Static.gateway = new ServerGateway();
	Static.gameResourceManager = new GameResourceManager();
	Static.gameResourceManager.load(Items); 
	Static.battleField.initialize([shipInfo]
				      ,require("./share/map.js").map)
	console.log("add ship");
    }
    ServerWorld.prototype.next = function(){
	ServerWorld.parent.prototype.next.call(this);
	Static.battleField.next(); 
	console.log(Static.battleField.time);
    }
    exports.ServerWorld = ServerWorld;
})(exports)