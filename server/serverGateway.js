(function(exports){
    var Class = require("./share/util").Class;
    var Static = require("./share/static").Static;
    
    var Container = require("./share/util").Container;
    var OperateEnum = require("./share/protocol").OperateEnum;
    var EventEmitter = require("./share/util").EventEmitter;
    var ServerGateway = Container.sub();
    EventEmitter.mixin(ServerGateway)
    ServerGateway.prototype._init = function(){
	Static.battleField.on("end",function(){
	    Static.team = {};
	})
    }
    ServerGateway.prototype.onConnect = function(worker){
	console.log("connection");
	var self = this;
	if(this.parts.length>=2){
	    worker.send({
		err:true
		,description:"maximum player"
	    })
	    worker.close();
	    return;
	} 
	console.log("worker count",this.parts.length);
	worker.on("close",function(worker){
	    self.remove(worker)
	    console.log("remove");
	    console.log("lost connection");
	})
	worker.on("message",function(msg){
	    console.log("msg",msg);
	    self.onMessage(msg,worker);
	}) 
	this.add(worker);
    }
    ServerGateway.prototype.boardCast = function(msg){
	msg.time = Static.battleField.time+10;
	console.log("board cast",msg);
	Static.battleField.addInstruction(msg);
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    item.send(msg);
	}
    }
    ServerGateway.prototype.onMessage = function(msg,who){
	//sync 
	if(msg.cmd==OperateEnum.SYNC){
	    if(!msg.username){
		console.warn("sync without username");
		return;
	    }
	    if(!Static.team){
		Static.team = {};
	    }
	    var team = null;
	    var notReady;
	    var aboutToReady;
	    if(!Static.team[0]||!Static.team[1]){
		notReady = true;
	    }
	    if(!Static.team[0] ||  Static.team[0]==msg.username){
		Static.team[0] = msg.username;
		team = "0";
	    }else if(!Static.team[1] || Static.team[1]==msg.username){
		Static.team[1] = msg.username;
		team = "1";
	    }
	    if(Static.team[0]&&Static.team[1]){
		aboutToReady = true;
	    }
	    
	    if(notReady&&aboutToReady){
		this.emit("aboutToReady");
	    }
	    if(team){
		who.send({
		    cmd:OperateEnum.SYNC
		    ,data:Static.battleField.toData()
 		    ,time:Static.battleField.time
		    ,team:team //your team
		    ,teamInfo:Static.battleField.teamInfo
		    ,allTeam:Static.team //2 teams
		    ,ready:!notReady
		})
	    }else{
		who.send({err:true,errorDescription:"user full"});
	    }
	    return;
	}
	this.boardCast(msg)
    }
    exports.ServerGateway = ServerGateway;
})(exports)