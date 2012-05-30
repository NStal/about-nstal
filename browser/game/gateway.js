(function(exports){
    var Class = require("./share/util").Class;
    var Static = require("./share/static").Static;
    var Container = require("./share/util").Container;
    var EventEmitter = require("./share/util").EventEmitter;
    var Gateway = Container.sub(); 
    EventEmitter.mixin(Gateway)
    Gateway.prototype._init = function(){
	var self = this;
	this.buffer = [];
	this.index = 0;
	this.connector = new Connector(Static.settings.host
				       ,Static.settings.port);
	this.connector.on("open",function(){
	    self.ready = true;
	    self.emit("open");
	})
	this.connector.on("close",function(){
	    self.ready = false;
	    console.error("掉线了:(");
	    window.location.href = window.location.href;
	})
	
	this.connector.on("message",function(msg){
	    if(msg.cmd == OperateEnum.CHAT){
		self.emit("chat",msg.username,msg.data);
		return;
	    }
	    if(msg.cmd == OperateEnum.SYNC){
		Static.battleField.time = msg.time;
		Static.userteam = msg.team;
		Static.battleField.team = msg.allTeam;
		Static.battleField.teamInfo = msg.teamInfo;
		Static.battleField.initialize(msg.data.ships,
					      map);
		if(msg.ready){
		    Static.waitPage.hide();
		}
		return;
	    }
	    Static.battleField.addInstruction(msg);
	})
	
    }
    Gateway.prototype.connect = function(){
	this.connector.start();
    }
    Gateway.prototype.next = function(){
	this.index++;
	if(this.index==3){
	    this.index = 0;
	    this._send();
	}
    }
    Gateway.prototype._send = function(){
	for(var i=0;i<this.buffer.length;i++){
	    var item = this.buffer[i] 
	    this.connector.send(item); 
	}
	this.buffer.length = 0;
    }
    Gateway.prototype.send = function(msg){
	this.connector.send(msg);
	//this.buffer.push(msg);
    }
    exports.Gateway = Gateway;
})(exports)