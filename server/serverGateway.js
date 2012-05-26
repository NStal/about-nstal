(function(exports){
    var Class = require("./share/util").Class;
    var Static = require("./share/static").Static;
    
    var Container = require("./share/util").Container;
    var OperateEnum = require("./share/protocol").OperateEnum;
    var EventEmitter = require("./share/util").EventEmitter;
    var ServerGateway = Container.sub(); 
    EventEmitter.mixin(ServerGateway)
    ServerGateway.prototype._init = function(){
    }
    ServerGateway.prototype.onConnect = function(worker){
	this.add(worker);
	console.log("connection");
	var self = this;
	worker.on("close",function(worker){
	    self.remove(worker);
	    console.log("lost connection");
	})
	worker.on("message",function(msg){
	    console.log("msg",msg);
	    self.onMessage(msg,worker);
	}) 
    }
    ServerGateway.prototype.boardCast = function(msg){
	msg.time = Static.battleField.time+5;
	Static.battleField.addInstruction(msg);
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    item.send(msg);
	}
    }
    ServerGateway.prototype.onMessage = function(msg,who){
	//sync
	if(msg.cmd==OperateEnum.SYNC){
	    who.send({
		cmd:OperateEnum.SYNC
		,data:Static.battleField.toData()
		,time:Static.battleField.time
	    })
	    return;
	}
	this.boardCast(msg)
    }
    exports.ServerGateway = ServerGateway;
})(exports)