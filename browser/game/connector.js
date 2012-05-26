(function(exports){
    var EventEmitter = require("./util").EventEmitter
    var Connector = EventEmitter.sub();
    Connector.prototype._init = function(host,port){
	this.setServer(host,port);
	this.ws = null;
    }
    Connector.prototype.start = function(){
	this.ws = new WebSocket("ws://"+this.host+":"+this.port);
	var self = this;
	this.ws.onopen = function(){
	    self.emit("open");
	}
	this.ws.onmessage = function(msg){
	    var data = JSON.parse(msg.data.toString());
	    console.log(data);
	    self.emit("message",data)
	}
	this.ws.onclose = function(){
	    self.emit("close");
	}
    }
    Connector.prototype.setServer = function(host,port){
	this.host = host;
	this.port = port;
    }
    Connector.prototype.close = function(){
	if(this.ws)this.ws.close();
    }
    Connector.prototype.send = function(msg){
	if(typeof msg!="string"){
	    msg = JSON.stringify(msg);
	}
	if(this.ws){
	    console.log("send",msg); 
	    this.ws.send(msg);
	    return true;
	}else{
	    return false;
	}
    }
    exports.Connector = Connector;
})(exports)