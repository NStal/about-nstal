(function(exports){
    var Static = require("./share/static").Static;
    var ServerWorld = require("./share/world").World.sub();
    var Items = require("./share/item").Items;
    var GameResourceManager = require("./share/item").GameResourceManager;
    var ServerGateway = require("./serverGateway").ServerGateway;
    var BattleFieldSimulator = require("./share/battleFieldSimulator").BattleFieldSimulator;
    var Judger = require("./judger").Judger;
    var genShipInfo = function(){
	return{
	    cordinates:{x:100,y:100}
	    ,id:"1"
	    ,itemId:"2"
	}
    }
    Static.settings = require("../localshare/settings").settings;
    ServerWorld.prototype._init = function(){
	Static.battleField = new BattleFieldSimulator();
	Static.gateway = new ServerGateway();
	Static.gameResourceManager = new GameResourceManager();
	Static.gameResourceManager.load(Items);
	var info2 = genShipInfo();
	info2.id = "2"; 
	info2.cordinates.x = 700;
	info2.itemId = "1";
	this.map = require("./share/map.js").map
	Static.battleField.initialize([]
				      ,this.map);
	console.log("add ship");
	Static.judger = new Judger();
    }
    ServerWorld.prototype.next = function(){
	ServerWorld.parent.prototype.next.call(this);
	Static.battleField.next(); 
    }
    exports.ServerWorld = ServerWorld;
})(exports)