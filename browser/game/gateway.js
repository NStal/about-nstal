(function(exports){
    var Class = require("./share/util").Class;
    var Static = require("./share/static").Static;
    var Container = require("./share/util").Container;
    var EventEmitter = require("./share/util").EventEmitter;
    var Gateway = Container.sub(); 
    EventEmitter.mixin(Gateway)
    Gateway.prototype._init = function(){
	var self = this;
	this.connector = new Connector(Static.settings.host
				       ,Static.settings.port);
	this.connector.on("open",function(){
	    self.ready = true;
	    self.emit("open");
	})
	this.connector.on("close",function(){
	    self.ready = false;
	})
	this.connector.on("message",function(msg){
	    if(msg.cmd == OperateEnum.SYNC){
		Static.battleField.initialize(msg.data.ships,
					      map);
		Static.battleField.time = msg.time;
		return;
	    }
	    Static.battleField.addInstruction(msg);
	})
    }
    Gateway.prototype.connect = function(){
	this.connector.start();
    }
    Gateway.prototype.send = function(msg){
	this.connector.send(msg);
    }
    exports.Gateway = Gateway;
})(exports)